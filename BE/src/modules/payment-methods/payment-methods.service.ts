import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import {
  PaymentMethodConfig,
  PaymentMethodDocument,
} from './schemas/payment-method.schema';

@Injectable()
export class PaymentMethodsService implements OnModuleInit {
  constructor(
    @InjectModel(PaymentMethodConfig.name)
    private readonly paymentModel: Model<PaymentMethodDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.paymentModel.countDocuments().exec();
    if (count === 0) {
      await this.paymentModel.insertMany([
        {
          code: 'CASH',
          label: 'Tiền mặt',
          description: 'Thanh toán tại quầy',
          sortOrder: 1,
        },
        {
          code: 'BANK_TRANSFER',
          label: 'Chuyển khoản',
          description: 'CK / QR ngân hàng',
          sortOrder: 2,
        },
      ]);
    }
  }

  async findAll(activeOnly = false): Promise<PaymentMethodDocument[]> {
    const filter = activeOnly ? { isActive: true } : {};
    return this.paymentModel.find(filter).sort({ sortOrder: 1 }).exec();
  }

  async findByCode(code: string): Promise<PaymentMethodDocument | null> {
    return this.paymentModel.findOne({ code: code.toUpperCase(), isActive: true }).exec();
  }

  async create(dto: CreatePaymentMethodDto): Promise<PaymentMethodDocument> {
    const code = dto.code.toUpperCase();
    const exists = await this.paymentModel.findOne({ code }).exec();
    if (exists) throw new ConflictException('Mã phương thức đã tồn tại');

    const doc = new this.paymentModel({ ...dto, code });
    return doc.save();
  }

  async update(
    id: string,
    dto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodDocument> {
    if (dto.code) {
      const code = dto.code.toUpperCase();
      const dup = await this.paymentModel.findOne({
        code,
        _id: { $ne: id },
      });
      if (dup) throw new ConflictException('Mã phương thức đã tồn tại');
      dto.code = code;
    }

    const doc = await this.paymentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Không tìm thấy phương thức thanh toán');
    return doc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Không tìm thấy phương thức thanh toán');
  }
}
