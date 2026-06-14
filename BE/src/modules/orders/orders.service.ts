import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  isPendingStatus,
  normalizeOrderStatus,
  OrderStatus,
} from '../../common/enums/order-status.enum';
import { WorkShift } from '../../common/enums/work-shift.enum';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { InventoryService } from '../inventory/inventory.service';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateKitchenStatusDto } from './dto/update-kitchen-status.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { UserDocument } from '../users/schemas/user.schema';

const ACTIVE_STATUSES = [
  OrderStatus.PENDING,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.CONFIRMED,
  OrderStatus.SERVING,
];

const KITCHEN_TRANSITIONS: Record<string, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PREPARING],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING],
  [OrderStatus.PREPARING]: [OrderStatus.READY],
  [OrderStatus.SERVING]: [OrderStatus.READY],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly paymentMethodsService: PaymentMethodsService,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
  ) {}

  private getTodayRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return { start, end };
  }

  private async generateDailyNumbers(): Promise<{
    invoiceNumber: string;
    orderNumber: string;
    dailySequence: number;
  }> {
    // Use an atomic counter in a separate collection to avoid race conditions
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${yy}${mm}${dd}`;

    const countersColl = this.orderModel.db.collection('order_counters');
    const key = `orders:${datePrefix}`;

    // ensure the counter is at least the number of existing orders today
    const { start, end } = this.getTodayRange();
    const existingCount = await this.orderModel.countDocuments({
      createdAt: { $gte: start, $lt: end },
    });

    // Use an update pipeline so we can atomically set seq = (existing seq || existingCount) + 1
    const res = await countersColl.findOneAndUpdate(
      { _id: key as any },
      [
        {
          $set: {
            seq: { $add: [{ $ifNull: ['$seq', existingCount] }, 1] },
            createdAt: { $ifNull: ['$createdAt', new Date()] },
          },
        },
      ],
      { upsert: true, returnDocument: 'after' } as any,
    );

    const seq = (res.value && res.value.seq) || 1;
    console.log('[OrdersService] generateDailyNumbers', { datePrefix, seq });
    const seqStr = String(seq).padStart(2, '0');
    const shortSuffix = new Types.ObjectId().toString().slice(-4);

    return {
      invoiceNumber: `${datePrefix}${seqStr}${shortSuffix}`,
      // make orderNumber globally unique by including date prefix and suffix
      orderNumber: `${datePrefix}${seqStr}${shortSuffix}`,
      dailySequence: seq,
    };
  }

  private formatDatePrefix(now = new Date()) {
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yy}${mm}${dd}`;
  }

  private async bumpCounter(): Promise<{ invoiceNumber: string; orderNumber: string; dailySequence: number }> {
    const now = new Date();
    const datePrefix = this.formatDatePrefix(now);
    const countersColl = this.orderModel.db.collection('order_counters');
    const key = `orders:${datePrefix}`;

    const res = await countersColl.findOneAndUpdate(
      { _id: key as any },
      { $inc: { seq: 1 }, $setOnInsert: { createdAt: new Date() } } as any,
      { upsert: true, returnDocument: 'after' } as any,
    );
    const seq = (res.value && res.value.seq) || 1;
    const seqStr = String(seq).padStart(2, '0');
    const shortSuffix = new Types.ObjectId().toString().slice(-4);
    console.log('[OrdersService] bumpCounter', { datePrefix, seq, shortSuffix });
    return {
      invoiceNumber: `${datePrefix}${seqStr}${shortSuffix}`,
      orderNumber: `${datePrefix}${seqStr}${shortSuffix}`,
      dailySequence: seq,
    };
  }

  async create(
    createOrderDto: CreateOrderDto,
    staff: UserDocument,
  ): Promise<OrderDocument> {
    const payment = await this.paymentMethodsService.findByCode(
      createOrderDto.paymentMethod,
    );
    if (!payment) {
      throw new BadRequestException('Phương thức thanh toán không hợp lệ');
    }

    let { orderNumber: _orderNumber, invoiceNumber: _invoiceNumber, dailySequence: _dailySequence } =
      await this.generateDailyNumbers();
    let ord = _orderNumber;
    let inv = _invoiceNumber;
    let seq = _dailySequence;

    const tableNumber =
      createOrderDto.tableNumber?.trim() || ord;

    const buildOrder = (ordNum: string, invNum: string, seq: number) =>
      new this.orderModel({
        ...createOrderDto,
        tableNumber,
        orderNumber: ordNum,
        invoiceNumber: invNum,
        dailySequence: seq,
        staffId: staff._id,
        staffName: staff.fullName,
        status: OrderStatus.PENDING,
        items: createOrderDto.items.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          basePrice: item.basePrice,
          toppings: item.toppings ?? [],
          price: item.price,
          quantity: item.quantity,
          note: item.note,
        })),
      });

    // Try saving the order, retrying if orderNumber collides (concurrent requests)
    const maxRetries = 3;
    let attempt = 0;
    let lastError: unknown = null;

    while (attempt < maxRetries) {
      attempt += 1;
      const currentOrder = buildOrder(ord, inv, seq);
      try {
        return await currentOrder.save();
      } catch (err: any) {
        lastError = err;
        // If duplicate key on orderNumber, regenerate numbers and retry
        const isDupOrderNumber =
          err && err.code === 11000 && err.keyValue && err.keyValue.orderNumber;
        if (!isDupOrderNumber) break;

        // get next sequence value atomically to avoid repeating the same number
        const regenerated = await this.bumpCounter();
        // update for next attempt
        ord = regenerated.orderNumber;
        inv = regenerated.invoiceNumber;
        seq = regenerated.dailySequence;
      }
    }

    // if we get here, rethrow the last error
    throw lastError;
  }

  async findToday(
    workShift?: WorkShift,
    activeOnly = false,
  ): Promise<OrderDocument[]> {
    const { start, end } = this.getTodayRange();
    const filter: Record<string, unknown> = {
      createdAt: { $gte: start, $lt: end },
    };

    if (workShift) filter.workShift = workShift;
    if (activeOnly) {
      filter.status = { $in: ACTIVE_STATUSES };
    }

    return this.orderModel
      .find(filter)
      .sort({ dailySequence: 1, createdAt: -1 })
      .exec();
  }

  async findActiveForServer(workShift?: WorkShift): Promise<OrderDocument[]> {
    const filter: Record<string, unknown> = {
      status: {
        $in: [OrderStatus.READY, OrderStatus.PREPARING, OrderStatus.SERVING],
      },
    };
    if (workShift) filter.workShift = workShift;
    return this.orderModel
      .find(filter)
      .sort({ dailySequence: 1 })
      .exec();
  }

  async findByShift(workShift: WorkShift): Promise<OrderDocument[]> {
    return this.findToday(workShift, true);
  }

  async updateByCashier(
    id: string,
    dto: UpdateOrderDto,
  ): Promise<OrderDocument> {
    const order = await this.findById(id);

    if (!isPendingStatus(order.status)) {
      throw new ForbiddenException(
        'Chỉ sửa được đơn ở trạng thái "Chưa thực hiện"',
      );
    }

    if (dto.items) {
      order.items = dto.items.map((item) => ({
        menuItemId: new Types.ObjectId(item.menuItemId),
        name: item.name,
        basePrice: item.basePrice,
        toppings: item.toppings ?? [],
        price: item.price,
        quantity: item.quantity,
        note: item.note,
      }));
    }

    if (dto.customerName !== undefined) order.customerName = dto.customerName;
    if (dto.customerPhone !== undefined) order.customerPhone = dto.customerPhone;
    if (dto.tableNumber !== undefined) order.tableNumber = dto.tableNumber;
    if (dto.note !== undefined) order.note = dto.note;
    if (dto.subtotal !== undefined) order.subtotal = dto.subtotal;
    if (dto.total !== undefined) order.total = dto.total;

    return order.save();
  }

  async cancel(id: string, dto: CancelOrderDto): Promise<OrderDocument> {
    const order = await this.findById(id);

    if (!isPendingStatus(order.status)) {
      throw new ForbiddenException(
        'Chỉ hủy được đơn ở trạng thái "Chưa thực hiện"',
      );
    }

    if (order.paymentMethod === 'BANK_TRANSFER') {
      throw new BadRequestException(
        'Đơn chuyển khoản không thể hủy vì không hoàn tiền được',
      );
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelReason = dto.cancelReason;
    order.cancelledAt = new Date();
    return order.save();
  }

  async updateKitchenStatus(
    id: string,
    dto: UpdateKitchenStatusDto,
  ): Promise<OrderDocument> {
    const order = await this.findById(id);
    const current = normalizeOrderStatus(order.status);
    const next = normalizeOrderStatus(dto.status);

    const allowed = KITCHEN_TRANSITIONS[current] ?? [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Không thể chuyển từ "${current}" sang "${next}"`,
      );
    }

    order.status = next;
    const saved = await order.save();

    if (next === OrderStatus.READY) {
      await this.inventoryService.deductForOrder(saved._id.toString());
    }

    return saved;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDocument> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return order;
  }

  async findById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return order;
  }
}
