import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SKIP_SUBSCRIPTION_KEY } from '../decorators/skip-subscription.decorator';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_SUBSCRIPTION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (skip) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const status: string =
      request.subscriptionStatus ?? SubscriptionStatus.ACTIVE;

    if (
      status === SubscriptionStatus.EXPIRED ||
      status === SubscriptionStatus.SUSPENDED
    ) {
      const method = request.method?.toUpperCase();
      if (MUTATING.has(method)) {
        throw new ForbiddenException(
          'Gói đã hết hạn. Nâng cấp hoặc gia hạn để tiếp tục sử dụng BOBAPOS.',
        );
      }
    }

    return true;
  }
}
