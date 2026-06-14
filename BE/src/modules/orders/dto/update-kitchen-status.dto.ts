import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../../common/enums/order-status.enum';

export class UpdateKitchenStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
