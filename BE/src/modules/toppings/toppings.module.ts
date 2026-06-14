import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Topping, ToppingSchema } from './schemas/topping.schema';
import { ToppingsController } from './toppings.controller';
import { ToppingsService } from './toppings.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Topping.name, schema: ToppingSchema }]),
  ],
  controllers: [ToppingsController],
  providers: [ToppingsService],
  exports: [ToppingsService],
})
export class ToppingsModule {}
