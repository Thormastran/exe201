import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { getTenantStore } from '../tenant/tenant-context';
import type { UserDocument } from '../../modules/users/schemas/user.schema';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserDocument | undefined;
    if (!user?.tenantId) {
      throw new ForbiddenException('Không xác định được cửa hàng (tenant)');
    }

    const tenantId = user.tenantId.toString();
    const plan =
      (user as { subscriptionPlan?: string }).subscriptionPlan ??
      request.subscriptionPlan ??
      'STANDARD';
    const subscriptionStatus =
      (user as { subscriptionStatus?: string }).subscriptionStatus ??
      request.subscriptionStatus ??
      'ACTIVE';

    request.tenantId = tenantId;
    request.subscriptionPlan = plan;
    request.subscriptionStatus = subscriptionStatus;

    const store = getTenantStore();
    if (store) {
      store.tenantId = tenantId;
      store.plan = plan;
      store.subscriptionStatus = subscriptionStatus;
    }

    return true;
  }
}
