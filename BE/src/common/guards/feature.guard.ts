import {

  CanActivate,

  ExecutionContext,

  ForbiddenException,

  Injectable,

} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { planHasFeature, planLabel } from '../saas/plan-features';

import { SaasFeature } from '../enums/saas-feature.enum';

import { SubscriptionPlan } from '../enums/subscription-plan.enum';

import { SubscriptionStatus } from '../enums/subscription-status.enum';

import { REQUIRE_FEATURE_KEY } from '../decorators/require-feature.decorator';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';



@Injectable()

export class FeatureGuard implements CanActivate {

  constructor(private reflector: Reflector) {}



  canActivate(context: ExecutionContext): boolean {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [

      context.getHandler(),

      context.getClass(),

    ]);

    if (isPublic) {

      return true;

    }



    const features = this.reflector.getAllAndOverride<SaasFeature[]>(

      REQUIRE_FEATURE_KEY,

      [context.getHandler(), context.getClass()],

    );

    if (!features?.length) {

      return true;

    }



    const request = context.switchToHttp().getRequest();

    const plan: string = request.subscriptionPlan ?? SubscriptionPlan.STANDARD;

    const status: string =

      request.subscriptionStatus ?? SubscriptionStatus.ACTIVE;



    for (const feature of features) {

      if (!planHasFeature(plan, status, feature)) {

        throw new ForbiddenException(

          `Tính năng này không có trong gói ${planLabel(plan as SubscriptionPlan)}. Vui lòng nâng cấp.`,

        );

      }

    }



    return true;

  }

}


