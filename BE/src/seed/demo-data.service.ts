import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderStatus } from '../common/enums/order-status.enum';
import { Role } from '../common/enums/role.enum';
import { WorkShift } from '../common/enums/work-shift.enum';
import { MenuItem, MenuItemDocument } from '../modules/menu/schemas/menu-item.schema';
import { Order, OrderDocument } from '../modules/orders/schemas/order.schema';
import { User, UserDocument } from '../modules/users/schemas/user.schema';

@Injectable()
export class DemoDataService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DemoDataService.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(MenuItem.name) private readonly menuModel: Model<MenuItemDocument>,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.SEED_DEMO_ORDERS === 'false') return;
    await this.seedDemoOrders();
  }

  private async seedDemoOrders() {
    const exists = await this.orderModel
      .countDocuments({ orderNumber: { $regex: /^DEMO-/ } })
      .exec();
    if (exists > 0) return;

    const staff = await this.userModel.findOne({ role: Role.STAFF }).exec();
    const menu = await this.menuModel.find({ isAvailable: true }).limit(4).exec();
    if (!staff || menu.length < 2) return;

    const today = new Date();
    const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, '');

    const samples: {
      orderNumber: string;
      status: OrderStatus;
      table: string;
      items: typeof menu;
    }[] = [
      {
        orderNumber: 'DEMO-001',
        status: OrderStatus.PREPARING,
        table: 'B05',
        items: menu.slice(0, 2),
      },
      {
        orderNumber: 'DEMO-002',
        status: OrderStatus.READY,
        table: 'B12',
        items: menu.slice(1, 3),
      },
      {
        orderNumber: 'DEMO-003',
        status: OrderStatus.PENDING,
        table: 'Mang đi',
        items: menu.slice(0, 1),
      },
    ];

    let seq = 1;
    for (const s of samples) {
      const lines = s.items.map((m) => ({
        menuItemId: m._id,
        name: m.name,
        basePrice: m.price,
        toppings: [],
        price: m.price,
        quantity: 1,
      }));
      const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
      await this.orderModel.create({
        orderNumber: s.orderNumber,
        invoiceNumber: `${datePrefix}${String(seq).padStart(4, '0')}`,
        dailySequence: seq,
        items: lines,
        tableNumber: s.table,
        paymentMethod: 'CASH',
        workShift: WorkShift.MORNING,
        staffId: staff._id,
        staffName: staff.fullName,
        subtotal,
        total: subtotal,
        status: s.status,
        inventoryDeducted: s.status === OrderStatus.READY,
      });
      seq += 1;
    }

    this.logger.log('Đã tạo đơn mẫu DEMO-001..003 (bếp / phục vụ)');
  }
}
