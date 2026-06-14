import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { SubscriptionPlan } from '../../common/enums/subscription-plan.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { SkipSubscription } from '../../common/decorators/skip-subscription.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { SubscriptionsService } from './subscriptions.service';
import { TenantsService } from '../tenants/tenants.service';
import type { UserDocument } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Controller('subscription')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles(Role.ADMIN)
@SkipSubscription()
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly tenantsService: TenantsService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @Get()
  async getSubscription(@CurrentUser() user: UserDocument) {
    const tenantId = user.tenantId!.toString();
    const [tenant, sub] = await Promise.all([
      this.tenantsService.findById(tenantId),
      this.subscriptionsService.getForTenant(tenantId),
    ]);
    await this.subscriptionsService.syncExpiredStatus(tenant, sub);
    const employeeCount = await this.subscriptionsService.countEmployees(
      tenantId,
      this.userModel,
    );

    return {
      tenant: tenant.toJSON(),
      subscription: sub.toJSON(),
      trialDaysLeft: this.tenantsService.trialDaysLeft(tenant),
      daysLeft: this.subscriptionsService.daysLeft(sub),
      usage: {
        employees: employeeCount,
        maxEmployees: sub.maxEmployees,
        maxBranches: sub.maxBranches,
      },
    };
  }

  @Post('upgrade')
  async upgrade(
    @CurrentUser() user: UserDocument,
    @Body('plan') plan: SubscriptionPlan,
  ) {
    const tenantId = user.tenantId!.toString();
    const sub = await this.subscriptionsService.upgrade(tenantId, plan);
    const tenant = await this.tenantsService.findById(tenantId);
    tenant.packageType = plan;
    await tenant.save();
    return sub.toJSON();
  }
}
