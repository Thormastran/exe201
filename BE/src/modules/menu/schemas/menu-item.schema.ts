import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { applyTenantPlugin } from '../../../common/tenant/tenant-plugin';
import { ToppingOption, ToppingOptionSchema } from './topping.schema';

export type MenuItemDocument = MenuItem & Document;

@Schema({ timestamps: true, collection: 'menu_items' })
export class MenuItem {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', index: true })
  tenantId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  imageUrl?: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Topping' }], default: [] })
  toppingIds: Types.ObjectId[];

  @Prop({ type: [ToppingOptionSchema], default: [] })
  toppings: ToppingOption[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);

MenuItemSchema.index({ tenantId: 1, name: 1 });
applyTenantPlugin(MenuItemSchema);

MenuItemSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id?.toString(),
    name: ret.name,
    category: ret.category,
    price: ret.price,
    description: ret.description,
    imageUrl: ret.imageUrl,
    isAvailable: ret.isAvailable,
    toppingIds: ret.toppingIds?.map((id: { toString(): string }) => id.toString()),
    toppings: ret.toppings ?? [],
    createdAt: ret.createdAt,
    updatedAt: ret.updatedAt,
  }),
});
