import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { SubscriptionsService } from '../../subscriptions/subscriptions.service';

import { TenantsService } from '../../tenants/tenants.service';

import type { UserDocument } from '../../users/schemas/user.schema';

import { UsersService } from '../../users/users.service';



export interface JwtPayload {

  sub: string;

  email: string;

  role: string;

  tenantId?: string;

  plan?: string;

  subscriptionStatus?: string;

}



@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(

    configService: ConfigService,

    private readonly usersService: UsersService,

    private readonly tenantsService: TenantsService,

    private readonly subscriptionsService: SubscriptionsService,

  ) {

    super({

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'fallback-secret',

    });

  }



  async validate(payload: JwtPayload) {

    const user = await this.usersService.findById(payload.sub);



    if (!user || !user.isActive) {

      throw new UnauthorizedException('Tài khoản không hợp lệ hoặc đã bị khóa');

    }



    const tenantId = user.tenantId?.toString() ?? payload.tenantId;

    if (!tenantId) {

      throw new UnauthorizedException('Tài khoản chưa gắn cửa hàng');

    }



    try {

      const [tenant, sub] = await Promise.all([

        this.tenantsService.findById(tenantId),

        this.subscriptionsService.getForTenant(tenantId),

      ]);

      await this.tenantsService.refreshStatusFromDates(tenant);

      await this.subscriptionsService.syncExpiredStatus(tenant, sub);



      (user as UserDocument & { subscriptionPlan?: string }).subscriptionPlan =

        sub.plan;

      (user as UserDocument & { subscriptionStatus?: string }).subscriptionStatus =

        sub.status;

    } catch {

      /* subscription row missing during migration */

    }



    return user;

  }

}


