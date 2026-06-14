import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusinessModel } from '../common/enums/business-model.enum';
import { Role } from '../common/enums/role.enum';
import { SubscriptionPlan } from '../common/enums/subscription-plan.enum';
import { TenantStatus } from '../common/enums/tenant-status.enum';
import { DEMO_PLAN_BY_SLUG, TRIAL_DAYS } from '../common/saas/plan-limits';
import { Branch, BranchDocument } from '../modules/branches/schemas/branch.schema';
import { SubscriptionsService } from '../modules/subscriptions/subscriptions.service';
import { TenantOnboardingService } from '../modules/tenants/tenant-onboarding.service';
import { TenantsService } from '../modules/tenants/tenants.service';
import { Tenant, TenantDocument } from '../modules/tenants/schemas/tenant.schema';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import { UsersService } from '../modules/users/users.service';
import { DemoInventorySeedService } from './demo-inventory.seed.service';

const CHAIN_BRANCHES = [
  { code: 'CN-Q1', name: 'Chi nhánh Quận 1' },
  { code: 'CN-Q7', name: 'Chi nhánh Quận 7' },
  { code: 'CN-TD', name: 'Chi nhánh Thủ Đức' },
];

const STORE_EMPLOYEES: {
  email: string;
  name: string;
  role: Role;
  username: string;
}[] = [
  { email: 'store-cashier@bobapos.test', name: 'Thu ngân', role: Role.STAFF, username: 'cashier' },
  { email: 'store-kitchen@bobapos.test', name: 'Bếp', role: Role.KITCHEN, username: 'kitchen' },
  { email: 'store-manager@bobapos.test', name: 'Quản lý ca', role: Role.STORE_MANAGER, username: 'manager' },
  { email: 'store-warehouse@bobapos.test', name: 'Thủ kho', role: Role.WAREHOUSE, username: 'warehouse' },
];

const CHAIN_EMPLOYEES: {
  email: string;
  name: string;
  role: Role;
  username: string;
}[] = [
  { email: 'chain-cashier1@bobapos.test', name: 'Thu ngân 1', role: Role.STAFF, username: 'cashier1' },
  { email: 'chain-cashier2@bobapos.test', name: 'Thu ngân 2', role: Role.STAFF, username: 'cashier2' },
  { email: 'chain-kitchen@bobapos.test', name: 'Bếp trưởng', role: Role.KITCHEN, username: 'kitchen' },
  { email: 'chain-warehouse@bobapos.test', name: 'Thủ kho', role: Role.WAREHOUSE, username: 'warehouse' },
  {
    email: 'chain-accounting@bobapos.test',
    name: 'Kế toán',
    role: Role.ACCOUNTING,
    username: 'accounting',
  },
  {
    email: 'chain-manager@bobapos.test',
    name: 'Quản lý ca',
    role: Role.STORE_MANAGER,
    username: 'manager',
  },
];

@Injectable()
export class DemoTenantsSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DemoTenantsSeedService.name);

  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
    @InjectModel(Branch.name) private readonly branchModel: Model<BranchDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly tenantsService: TenantsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly onboardingService: TenantOnboardingService,
    private readonly usersService: UsersService,
    private readonly demoInventorySeed: DemoInventorySeedService,
  ) {}

  async onApplicationBootstrap() {
    if (this.configService.get<string>('SEED_DEMO_TENANTS') === 'false') return;

    const chainEmail = this.configService.get<string>('SEED_DEMO_CHAIN_EMAIL');
    const chainPassword = this.configService.get<string>('SEED_DEMO_CHAIN_PASSWORD');
    const chainName = this.configService.get<string>('SEED_DEMO_CHAIN_NAME');

    const soloEmail = this.configService.get<string>('SEED_DEMO_SOLO_EMAIL');
    const soloPassword = this.configService.get<string>('SEED_DEMO_SOLO_PASSWORD');
    const soloName = this.configService.get<string>('SEED_DEMO_SOLO_NAME');

    const storeEmail = this.configService.get<string>('SEED_DEMO_STORE_EMAIL');
    const storePassword = this.configService.get<string>('SEED_DEMO_STORE_PASSWORD');
    const storeName = this.configService.get<string>('SEED_DEMO_STORE_NAME');

    const demos = [
      chainEmail && chainPassword && chainName
        ? {
            slug: 'demo-chain',
            storeName: 'BOBAPOS Chain Demo',
            businessModel: BusinessModel.LARGE,
            ownerEmail: chainEmail,
            ownerPassword: chainPassword,
            ownerName: chainName,
            extraBranches: CHAIN_BRANCHES,
            employees: CHAIN_EMPLOYEES.map((e) => ({
              ...e,
              password: chainPassword,
            })),
            log: 'CHAIN (chuỗi)',
          }
        : null,
      storeEmail && storePassword && storeName
        ? {
            slug: 'demo-store',
            storeName: 'BOBAPOS Store Demo',
            businessModel: BusinessModel.SMALL,
            ownerEmail: storeEmail,
            ownerPassword: storePassword,
            ownerName: storeName,
            employees: STORE_EMPLOYEES.map((e) => ({
              ...e,
              password: storePassword,
            })),
            log: 'STORE (cửa hàng + NV)',
          }
        : null,
      soloEmail && soloPassword && soloName
        ? {
            slug: 'demo-solo',
            storeName: 'BOBAPOS Solo Demo',
            businessModel: BusinessModel.SMALL,
            ownerEmail: soloEmail,
            ownerPassword: soloPassword,
            ownerName: soloName,
            log: 'SOLO (một mình)',
          }
        : null,
    ].filter(Boolean) as Array<{
      slug: string;
      storeName: string;
      businessModel: BusinessModel;
      ownerEmail: string;
      ownerPassword: string;
      ownerName: string;
      extraBranches?: { code: string; name: string }[];
      employees?: { email: string; password: string; name: string; role: Role; username: string }[];
      log: string;
    }>;

    for (const demo of demos) {
      try {
        await this.ensureDemoTenant(demo);
        this.logger.log(`Đã kiểm tra / tạo demo ${demo.log}`);
      } catch (err) {
        this.logger.error(`Lỗi seed demo ${demo.slug}`, err);
      }
    }
  }

  private async ensureDemoTenant(input: {
    slug: string;
    storeName: string;
    businessModel: BusinessModel;
    ownerEmail: string;
    ownerPassword: string;
    ownerName: string;
    extraBranches?: { code: string; name: string }[];
    employees?: { email: string; password: string; name: string; role: Role; username: string }[];
  }) {
    let tenant = await this.tenantsService.findBySlug(input.slug);
    if (!tenant) {
      const now = new Date();
      const trialExpiredAt = new Date(now);
      trialExpiredAt.setDate(trialExpiredAt.getDate() + TRIAL_DAYS);

      tenant = await this.tenantModel.create({
        storeName: input.storeName,
        slug: input.slug,
        businessModel: input.businessModel,
        packageType: SubscriptionPlan.PREMIUM,
        status: TenantStatus.TRIAL,
        trialExpiredAt,
      });

      await this.subscriptionsService.createTrialSubscription(tenant._id.toString());
      await this.onboardingService.seedTenantData(tenant._id.toString());
    }

    const tenantId = tenant._id.toString();

    const sub = await this.subscriptionsService.findByTenantId(tenantId);
    if (!sub) {
      await this.subscriptionsService.createTrialSubscription(tenantId);
    }

    await this.usersService.seedUserIfNotExists(
      input.ownerEmail,
      input.ownerPassword,
      input.ownerName,
      Role.ADMIN,
      { tenantId, phone: '0909000100', resetPassword: true },
    );

    let owner = await this.userModel
      .findOne({ tenantId: tenant._id, email: input.ownerEmail.toLowerCase() })
      .exec();

    if (!owner) {
      owner = await this.userModel
        .findOne({ tenantId: tenant._id, role: Role.ADMIN })
        .exec();
    }

    if (owner) {
      await this.tenantsService.attachOwner(tenantId, owner._id.toString());
    }

    if (input.extraBranches?.length) {
      for (const b of input.extraBranches) {
        const exists = await this.branchModel
          .findOne({ tenantId: tenant._id, code: b.code })
          .exec();
        if (!exists) {
          await this.branchModel.create({
            tenantId: tenant._id,
            code: b.code,
            name: b.name,
            isDefault: false,
            isActive: true,
          });
        }
      }
    }

    if (input.employees?.length) {
      for (const emp of input.employees) {
        try {
          await this.usersService.seedUserIfNotExists(
            emp.email,
            emp.password,
            emp.name,
            emp.role,
            { tenantId, username: emp.username, resetPassword: true },
          );
        } catch (err) {
          this.logger.warn(
            `Bỏ qua NV demo ${emp.username}@${input.slug}: ${(err as Error).message}`,
          );
        }
      }
    }

    await this.applyDemoSegmentPlan(tenantId, input.slug);

    if (this.configService.get<string>('SEED_DEMO_INVENTORY') !== 'false') {
      try {
        await this.demoInventorySeed.enrichTenant(tenantId, input.slug);
      } catch (err) {
        this.logger.warn(`Enrich kho demo ${input.slug}: ${(err as Error).message}`);
      }
    }
  }

  /** Demo thuyết trình: ACTIVE đúng gói SOLO / STORE / CHAIN (không trial full) */
  private async applyDemoSegmentPlan(tenantId: string, slug: string) {
    const plan = DEMO_PLAN_BY_SLUG[slug];
    if (!plan) return;
    await this.subscriptionsService.applyActivePlan(tenantId, plan);
    this.logger.log(`Đã gán gói ${plan} cho tenant demo ${slug}`);
  }
}
