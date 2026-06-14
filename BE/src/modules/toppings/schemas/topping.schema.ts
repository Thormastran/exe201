import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { applyTenantPlugin } from '../../../common/tenant/tenant-plugin';

export type ToppingDocument = Topping & Document;

@Schema({ timestamps: true, collection: 'toppings' })
export class Topping {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', index: true })
  tenantId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ToppingSchema = SchemaFactory.createForClass(Topping);

applyTenantPlugin(ToppingSchema);

ToppingSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id?.toString(),
    name: ret.name,
    price: ret.price,
    isActive: ret.isActive,
    sortOrder: ret.sortOrder,
    createdAt: ret.createdAt,
    updatedAt: ret.updatedAt,
  }),
});
