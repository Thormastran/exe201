import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { applyTenantPlugin } from '../../../common/tenant/tenant-plugin';

export type WarehouseStockDocument = WarehouseStock & Document;

@Schema({ timestamps: true, collection: 'warehouse_stocks' })
export class WarehouseStock {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', index: true })
  tenantId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'WarehouseLocation', required: true })
  warehouseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
  ingredientId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  currentStock: number;

  @Prop({ default: 0 })
  minStock: number;
}

export const WarehouseStockSchema = SchemaFactory.createForClass(WarehouseStock);

WarehouseStockSchema.index({ tenantId: 1, warehouseId: 1, ingredientId: 1 }, { unique: true });
applyTenantPlugin(WarehouseStockSchema);
