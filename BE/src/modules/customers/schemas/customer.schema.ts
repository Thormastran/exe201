import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true, collection: 'customers' })
export class Customer {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true, index: true })
  phone?: string;

  @Prop({ default: 0, min: 0 })
  points: number;

  @Prop({ default: 'MEMBER' })
  tier: string;

  @Prop({ default: 0 })
  totalOrders: number;

  @Prop({ default: 0 })
  totalSpent: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ tenantId: 1, phone: 1 });
