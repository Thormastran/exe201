import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BillingInvoiceStatus } from '../../common/enums/billing-invoice-status.enum';
import { SubscriptionPlan } from '../../common/enums/subscription-plan.enum';
import { PLAN_PRICING_VND } from '../../common/saas/plan-limits';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { BillingInvoice, BillingInvoiceDocument } from './schemas/billing-invoice.schema';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(BillingInvoice.name)
    private readonly invoiceModel: Model<BillingInvoiceDocument>,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async listByTenant(tenantId: string) {
    return this.invoiceModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async createCheckout(tenantId: string, plan: SubscriptionPlan, months = 1) {
    const amount = PLAN_PRICING_VND[plan] * months;
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + months);

    return new this.invoiceModel({
      tenantId: new Types.ObjectId(tenantId),
      plan,
      amount,
      currency: 'VND',
      status: BillingInvoiceStatus.PENDING,
      paymentMethod: 'MANUAL',
      periodStart: now,
      periodEnd,
      note: `Gia hạn ${months} tháng — ${plan}`,
    }).save();
  }

  /** Kích hoạt sau thanh toán (manual / webhook) */
  async markPaidAndActivate(invoiceId: string) {
    const invoice = await this.invoiceModel.findById(invoiceId).exec();
    if (!invoice) throw new NotFoundException('Không tìm thấy hóa đơn');

    invoice.status = BillingInvoiceStatus.PAID;
    await invoice.save();

    const periodStart = invoice.periodStart ?? new Date();
    const periodEnd = invoice.periodEnd ?? new Date();
    const months = Math.max(
      1,
      Math.round(
        (periodEnd.getTime() - periodStart.getTime()) /
          (1000 * 60 * 60 * 24 * 30),
      ) || 1,
    );

    await this.subscriptionsService.activateAfterPayment(
      invoice.tenantId.toString(),
      invoice.plan,
      months,
    );

    return invoice;
  }
}
