import { SetMetadata } from '@nestjs/common';
import { SaasFeature } from '../enums/saas-feature.enum';

export const REQUIRE_FEATURE_KEY = 'requireFeature';
export const RequireFeature = (...features: SaasFeature[]) =>
  SetMetadata(REQUIRE_FEATURE_KEY, features);
