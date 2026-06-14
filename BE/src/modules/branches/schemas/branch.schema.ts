import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BranchDocument = Branch & Document;

@Schema({ timestamps: true, collection: 'branches' })
export class Branch {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  address?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
BranchSchema.index({ tenantId: 1, code: 1 }, { unique: true });
