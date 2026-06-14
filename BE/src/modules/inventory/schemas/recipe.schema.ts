import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { applyTenantPlugin } from '../../../common/tenant/tenant-plugin';

export type RecipeDocument = Recipe & Document;

@Schema({ _id: false })
export class RecipeLine {
  @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
  ingredientId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  quantity: number;
}

export const RecipeLineSchema = SchemaFactory.createForClass(RecipeLine);

@Schema({ timestamps: true, collection: 'recipes' })
export class Recipe {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', index: true })
  tenantId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MenuItem', required: true })
  menuItemId: Types.ObjectId;

  @Prop({ type: [RecipeLineSchema], default: [] })
  lines: RecipeLine[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);

RecipeSchema.index({ tenantId: 1, menuItemId: 1 }, { unique: true });
applyTenantPlugin(RecipeSchema);

RecipeSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id?.toString(),
    menuItemId: ret.menuItemId?.toString(),
    lines: ret.lines?.map((l: RecipeLine & { ingredientId?: { toString(): string } }) => ({
      ingredientId: l.ingredientId?.toString?.() ?? l.ingredientId,
      quantity: l.quantity,
    })),
    createdAt: ret.createdAt,
    updatedAt: ret.updatedAt,
  }),
});
