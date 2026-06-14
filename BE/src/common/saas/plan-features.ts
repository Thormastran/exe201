import { SubscriptionPlan } from '../enums/subscription-plan.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { SaasFeature } from '../enums/saas-feature.enum';

/** Solo ≈ Tendoo hộ kinh doanh: POS + bếp + kho cơ bản, 1 chủ cửa hàng */
const SOLO_FEATURES = new Set<SaasFeature>([
  SaasFeature.POS,
  SaasFeature.MENU,
  SaasFeature.PAYMENTS,
  SaasFeature.BASIC_REPORTS,
  SaasFeature.STORE_SETTINGS,
  SaasFeature.KITCHEN,
  SaasFeature.WAREHOUSE,
  SaasFeature.RECIPE,
]);

const STORE_FEATURES = new Set<SaasFeature>([
  ...SOLO_FEATURES,
  SaasFeature.SHIFT_MGMT,
  SaasFeature.ACCOUNTING,
  SaasFeature.EMPLOYEES,
  SaasFeature.FULL_DASHBOARD,
]);

const CHAIN_FEATURES = new Set<SaasFeature>([
  ...STORE_FEATURES,
  SaasFeature.MULTI_BRANCH,
  SaasFeature.CRM,
  SaasFeature.LOYALTY,
  SaasFeature.MARKETING,
  SaasFeature.API_INTEGRATION,
  SaasFeature.KIOSK,
  SaasFeature.ADVANCED_ANALYTICS,
]);

const PLAN_FEATURES: Record<SubscriptionPlan, Set<SaasFeature>> = {
  [SubscriptionPlan.SOLO]: SOLO_FEATURES,
  [SubscriptionPlan.STANDARD]: STORE_FEATURES,
  [SubscriptionPlan.PREMIUM]: CHAIN_FEATURES,
};

/** Trial mới đăng ký = full Premium. Demo tenant ACTIVE theo gói thật. */
export function effectivePlan(
  plan: SubscriptionPlan | string,
  status: SubscriptionStatus | string,
): SubscriptionPlan {
  if (status === SubscriptionStatus.TRIAL) {
    return SubscriptionPlan.PREMIUM;
  }
  if (plan === SubscriptionPlan.SOLO || plan === 'SOLO') {
    return SubscriptionPlan.SOLO;
  }
  if (plan === SubscriptionPlan.PREMIUM || plan === 'PREMIUM') {
    return SubscriptionPlan.PREMIUM;
  }
  return SubscriptionPlan.STANDARD;
}

export function planHasFeature(
  plan: SubscriptionPlan | string,
  status: SubscriptionStatus | string,
  feature: SaasFeature,
): boolean {
  const effective = effectivePlan(plan, status);
  return PLAN_FEATURES[effective]?.has(feature) ?? false;
}

export function planLabel(plan: SubscriptionPlan): string {
  const labels: Record<SubscriptionPlan, string> = {
    [SubscriptionPlan.SOLO]: 'BOBAPOS Solo',
    [SubscriptionPlan.STANDARD]: 'BOBAPOS Store',
    [SubscriptionPlan.PREMIUM]: 'BOBAPOS Chain',
  };
  return labels[plan as SubscriptionPlan] ?? String(plan);
}
