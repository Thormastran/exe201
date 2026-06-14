import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SubscriptionPlan } from '../../../common/enums/subscription-plan.enum';
import { SubscriptionStatus } from '../../../common/enums/subscription-status.enum';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true, collection: 'subscriptions' })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, enum: SubscriptionPlan })
  plan: SubscriptionPlan;

  @Prop({ required: true, enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @Prop({ required: true })
  startedAt: Date;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: 10 })
  maxEmployees: number;

  @Prop({ default: 1 })
  maxBranches: number;

  @Prop({ default: false })
  trialUsed: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index({ tenantId: 1 }, { unique: true });

SubscriptionSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id?.toString(),
    tenantId: ret.tenantId?.toString(),
    plan: ret.plan,
    status: ret.status,
    startedAt: ret.startedAt,
    expiresAt: ret.expiresAt,
    maxEmployees: ret.maxEmployees,
    maxBranches: ret.maxBranches,
    trialUsed: ret.trialUsed,
    createdAt: ret.createdAt,
    updatedAt: ret.updatedAt,
  }),
});
