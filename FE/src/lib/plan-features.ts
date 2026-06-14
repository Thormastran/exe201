import { SaasFeature } from '@/models/saas-feature.model';
import { SubscriptionPlan, SubscriptionStatus } from '@/models/tenant.model';

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

export function effectivePlan(
  plan: string | SubscriptionPlan,
  status: string | SubscriptionStatus,
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
  plan: string | SubscriptionPlan,
  status: string | SubscriptionStatus,
  feature: SaasFeature,
): boolean {
  const effective = effectivePlan(plan, status);
  return PLAN_FEATURES[effective]?.has(feature) ?? false;
}

export function planLabel(plan: SubscriptionPlan | string): string {
  const labels: Record<string, string> = {
    [SubscriptionPlan.SOLO]: 'BOBAPOS Solo',
    [SubscriptionPlan.STANDARD]: 'BOBAPOS Store',
    [SubscriptionPlan.PREMIUM]: 'BOBAPOS Chain',
  };
  return labels[plan] ?? String(plan);
}

export function requiredPlanForFeature(feature: SaasFeature): SubscriptionPlan {
  if (SOLO_FEATURES.has(feature)) return SubscriptionPlan.SOLO;
  if (STORE_FEATURES.has(feature) && !SOLO_FEATURES.has(feature)) {
    return SubscriptionPlan.STANDARD;
  }
  return SubscriptionPlan.PREMIUM;
}
