import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { BusinessModel } from '../../common/enums/business-model.enum';
import { Role } from '../../common/enums/role.enum';
import { SubscriptionPlan } from '../../common/enums/subscription-plan.enum';
import { PLAN_LIMITS, PLAN_PRICING_VND } from '../../common/saas/plan-limits';
import { AuthService } from '../auth/auth.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { TenantOnboardingService } from '../tenants/tenant-onboarding.service';
import { TenantsService } from '../tenants/tenants.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterTenantDto } from './dto/register-tenant.dto';

@Injectable()
export class PublicService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tenantsService: TenantsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly onboardingService: TenantOnboardingService,
    private readonly authService: AuthService,
  ) {}

  getPlans() {
    return {
      trialDays: 7,
      plans: [
        {
          id: SubscriptionPlan.SOLO,
          name: 'BOBAPOS Solo',
          priceMonthly: PLAN_PRICING_VND[SubscriptionPlan.SOLO],
          maxEmployees: PLAN_LIMITS[SubscriptionPlan.SOLO].maxEmployees,
          maxBranches: PLAN_LIMITS[SubscriptionPlan.SOLO].maxBranches,
          features: [
            'POS thu ngân & thanh toán',
            'Menu, topping & in phiếu bếp (KDS)',
            'Kho nguyên liệu & công thức món',
            'Báo cáo doanh thu cơ bản',
            '1 chủ cửa hàng · 1 chi nhánh',
          ],
        },
        {
          id: SubscriptionPlan.STANDARD,
          name: 'BOBAPOS Store',
          priceMonthly: PLAN_PRICING_VND[SubscriptionPlan.STANDARD],
          maxEmployees: PLAN_LIMITS[SubscriptionPlan.STANDARD].maxEmployees,
          maxBranches: PLAN_LIMITS[SubscriptionPlan.STANDARD].maxBranches,
          features: [
            'Toàn bộ Solo',
            'Quản lý ca & phân quyền nhân viên',
            'Kế toán · duyệt phiếu · nhập NCC',
            'Dashboard vận hành đầy đủ',
            'Tối đa 10 nhân viên',
          ],
        },
        {
          id: SubscriptionPlan.PREMIUM,
          name: 'BOBAPOS Chain',
          priceMonthly: PLAN_PRICING_VND[SubscriptionPlan.PREMIUM],
          maxEmployees: PLAN_LIMITS[SubscriptionPlan.PREMIUM].maxEmployees,
          maxBranches: PLAN_LIMITS[SubscriptionPlan.PREMIUM].maxBranches,
          features: [
            'Toàn bộ Store',
            'Đa chi nhánh',
            'CRM & tích điểm',
            'Dashboard nâng cao & API',
          ],
        },
      ],
    };
  }

  suggestPlan(model: BusinessModel) {
    return model === BusinessModel.LARGE
      ? SubscriptionPlan.PREMIUM
      : SubscriptionPlan.STANDARD;
  }

  async register(dto: RegisterTenantDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const suggested = this.suggestPlan(dto.businessModel);
    const tenant = await this.tenantsService.createTrialTenant({
      storeName: dto.storeName,
      businessModel: dto.businessModel,
      suggestedPlan: suggested,
      phone: dto.phone,
    });

    await this.subscriptionsService.createTrialSubscription(tenant._id.toString());
    await this.onboardingService.seedTenantData(tenant._id.toString());

    const hashed = await bcrypt.hash(dto.password, 10);
    const owner = await this.userModel.create({
      tenantId: tenant._id,
      fullName: dto.ownerName,
      email,
      password: hashed,
      role: Role.ADMIN,
      phone: dto.phone,
      isActive: true,
    });

    await this.tenantsService.attachOwner(
      tenant._id.toString(),
      owner._id.toString(),
    );

    return this.authService.buildAuthResponse(owner);
  }
}
