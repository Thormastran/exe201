import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IngredientCategory } from '../../../common/enums/ingredient-category.enum';
import { applyTenantPlugin } from '../../../common/tenant/tenant-plugin';

export type IngredientDocument = Ingredient & Document;

@Schema({ timestamps: true, collection: 'ingredients' })
export class Ingredient {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', index: true })
  tenantId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  unit: string;

  @Prop({
    type: String,
    enum: IngredientCategory,
    default: IngredientCategory.OTHER,
  })
  category: IngredientCategory;

  @Prop({ required: true, default: 0 })
  currentStock: number;

  @Prop({ default: 0 })
  minStock: number;

  @Prop({ trim: true })
  sku?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);

IngredientSchema.index({ tenantId: 1, name: 1 }, { unique: true });
applyTenantPlugin(IngredientSchema);

IngredientSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id?.toString(),
    name: ret.name,
    unit: ret.unit,
    category: ret.category,
    currentStock: ret.currentStock,
    minStock: ret.minStock,
    sku: ret.sku,
    createdAt: ret.createdAt,
    updatedAt: ret.updatedAt,
  }),
});
