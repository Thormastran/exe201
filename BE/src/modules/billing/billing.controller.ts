import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { SubscriptionPlan } from '../../common/enums/subscription-plan.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { SkipSubscription } from '../../common/decorators/skip-subscription.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { BillingService } from './billing.service';
import type { UserDocument } from '../users/schemas/user.schema';

@Controller('billing')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles(Role.ADMIN)
@SkipSubscription()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoices')
  list(@CurrentUser() user: UserDocument) {
    return this.billingService.listByTenant(user.tenantId!.toString());
  }

  @Post('checkout')
  checkout(
    @CurrentUser() user: UserDocument,
    @Body('plan') plan: SubscriptionPlan,
    @Body('months') months?: number,
  ) {
    return this.billingService.createCheckout(
      user.tenantId!.toString(),
      plan,
      months ?? 1,
    );
  }

  @Post('invoices/:id/confirm-paid')
  confirmPaid(@Param('id') id: string) {
    return this.billingService.markPaidAndActivate(id);
  }
}
