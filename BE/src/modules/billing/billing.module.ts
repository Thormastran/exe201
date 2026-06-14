import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { BillingInvoice, BillingInvoiceSchema } from './schemas/billing-invoice.schema';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BillingInvoice.name, schema: BillingInvoiceSchema },
    ]),
    SubscriptionsModule,
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
