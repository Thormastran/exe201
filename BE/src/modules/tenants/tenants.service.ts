import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusinessModel } from '../../common/enums/business-model.enum';
import { SubscriptionPlan } from '../../common/enums/subscription-plan.enum';
import { TenantStatus } from '../../common/enums/tenant-status.enum';
import { TRIAL_DAYS } from '../../common/saas/plan-limits';
import { Tenant, TenantDocument } from './schemas/tenant.schema';

export function slugifyStoreName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
  ) {}

  async findById(id: string): Promise<TenantDocument> {
    const t = await this.tenantModel.findById(id).exec();
    if (!t) throw new NotFoundException('Không tìm thấy cửa hàng');
    return t;
  }

  async findBySlug(slug: string): Promise<TenantDocument | null> {
    return this.tenantModel.findOne({ slug: slug.toLowerCase() }).exec();
  }

  async getDefaultTenant(): Promise<TenantDocument | null> {
    return this.tenantModel.findOne({ slug: 'teaflow-legacy' }).exec();
  }

  async createTrialTenant(input: {
    storeName: string;
    businessModel: BusinessModel;
    suggestedPlan: SubscriptionPlan;
    phone?: string;
  }): Promise<TenantDocument> {
    let slug = slugifyStoreName(input.storeName);
    const taken = await this.findBySlug(slug);
    if (taken) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const now = new Date();
    const trialExpiredAt = new Date(now);
    trialExpiredAt.setDate(trialExpiredAt.getDate() + TRIAL_DAYS);

    const tenant = new this.tenantModel({
      storeName: input.storeName.trim(),
      slug,
      businessModel: input.businessModel,
      packageType: SubscriptionPlan.PREMIUM,
      status: TenantStatus.TRIAL,
      trialExpiredAt,
      settings: { phone: input.phone },
    });

    try {
      return await tenant.save();
    } catch {
      throw new ConflictException('Tên cửa hàng hoặc slug đã tồn tại');
    }
  }

  async attachOwner(tenantId: string, ownerUserId: string) {
    await this.tenantModel
      .findByIdAndUpdate(tenantId, { ownerUserId: new Types.ObjectId(ownerUserId) })
      .exec();
  }

  async refreshStatusFromDates(tenant: TenantDocument): Promise<TenantDocument> {
    const now = new Date();
    if (tenant.status === TenantStatus.SUSPENDED) {
      return tenant;
    }

    const trialEnd = tenant.trialExpiredAt;
    const subEnd = tenant.subscriptionExpiredAt;

    if (tenant.status === TenantStatus.TRIAL && trialEnd && trialEnd < now) {
      tenant.status = TenantStatus.EXPIRED;
      await tenant.save();
      return tenant;
    }

    if (
      tenant.status === TenantStatus.ACTIVE &&
      subEnd &&
      subEnd < now
    ) {
      tenant.status = TenantStatus.EXPIRED;
      await tenant.save();
    }

    return tenant;
  }

  trialDaysLeft(tenant: TenantDocument): number {
    if (!tenant.trialExpiredAt) return 0;
    const diff = tenant.trialExpiredAt.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
