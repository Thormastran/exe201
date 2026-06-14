import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { tenantStorage, TenantStore } from './tenant-context';

/** Mỗi request một ALS context — tránh enterWith rò tenant sang request khác */
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(_req: Request, _res: Response, next: NextFunction) {
    const store: TenantStore = {
      tenantId: '',
      plan: 'STANDARD',
      subscriptionStatus: 'ACTIVE',
    };
    tenantStorage.run(store, () => next());
  }
}
