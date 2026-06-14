import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StockMovementType } from '../../../common/enums/stock-movement-type.enum';
import { applyTenantPlugin } from '../../../common/tenant/tenant-plugin';

export type StockMovementDocument = StockMovement & Document;

@Schema({ timestamps: true, collection: 'stock_movements' })
export class StockMovement {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', index: true })
  tenantId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
  ingredientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'WarehouseLocation', required: true })
  warehouseId: Types.ObjectId;

  @Prop({ required: true, enum: StockMovementType })
  type: StockMovementType;

  /** Số dương = nhập, số âm = xuất */
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  balanceAfter: number;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SupplierReceipt' })
  supplierReceiptId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StockTransferRequest' })
  stockRequestId?: Types.ObjectId;

  @Prop()
  note?: string;

  @Prop()
  movementDate?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const StockMovementSchema = SchemaFactory.createForClass(StockMovement);

applyTenantPlugin(StockMovementSchema);

StockMovementSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id?.toString(),
    ingredientId: ret.ingredientId?.toString(),
    warehouseId: ret.warehouseId?.toString(),
    type: ret.type,
    quantity: ret.quantity,
    balanceAfter: ret.balanceAfter,
    orderId: ret.orderId?.toString(),
    supplierReceiptId: ret.supplierReceiptId?.toString(),
    stockRequestId: ret.stockRequestId?.toString(),
    note: ret.note,
    movementDate: ret.movementDate,
    createdAt: ret.createdAt,
  }),
});
