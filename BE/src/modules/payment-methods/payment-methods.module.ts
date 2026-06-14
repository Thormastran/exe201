import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentMethodConfig,
  PaymentMethodSchema,
} from './schemas/payment-method.schema';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsService } from './payment-methods.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentMethodConfig.name, schema: PaymentMethodSchema },
    ]),
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
