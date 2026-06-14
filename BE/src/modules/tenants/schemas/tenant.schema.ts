import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BusinessModel } from '../../../common/enums/business-model.enum';
import { SubscriptionPlan } from '../../../common/enums/subscription-plan.enum';
import { TenantStatus } from '../../../common/enums/tenant-status.enum';

export type TenantDocument = Tenant & Document;

@Schema({ _id: false })
export class TenantSettings {
  @Prop()
  logoUrl?: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop({ default: 'Asia/Ho_Chi_Minh' })
  timezone?: string;
}

export const TenantSettingsSchema = SchemaFactory.createForClass(TenantSettings);

@Schema({ timestamps: true, collection: 'tenants' })
export class Tenant {
  @Prop({ required: true, trim: true })
  storeName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ required: true, enum: BusinessModel, default: BusinessModel.SMALL })
  businessModel: BusinessModel;

  @Prop({ required: true, enum: SubscriptionPlan, default: SubscriptionPlan.PREMIUM })
  packageType: SubscriptionPlan;

  @Prop({ required: true, enum: TenantStatus, default: TenantStatus.TRIAL })
  status: TenantStatus;

  @Prop()
  trialExpiredAt?: Date;

  @Prop()
  subscriptionExpiredAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  ownerUserId?: Types.ObjectId;

  @Prop({ type: TenantSettingsSchema, default: {} })
  settings: TenantSettings;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

TenantSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id?.toString(),
    storeName: ret.storeName,
    slug: ret.slug,
    businessModel: ret.businessModel,
    packageType: ret.packageType,
    status: ret.status,
    trialExpiredAt: ret.trialExpiredAt,
    subscriptionExpiredAt: ret.subscriptionExpiredAt,
    ownerUserId: ret.ownerUserId?.toString(),
    settings: ret.settings,
    createdAt: ret.createdAt,
    updatedAt: ret.updatedAt,
  }),
});
