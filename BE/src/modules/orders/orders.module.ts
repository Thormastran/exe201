import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryModule } from '../inventory/inventory.module';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    PaymentMethodsModule,
    forwardRef(() => InventoryModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
