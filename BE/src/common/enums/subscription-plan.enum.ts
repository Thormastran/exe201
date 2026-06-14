export enum SubscriptionPlan {
  SOLO = 'SOLO',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
}

export const SUBSCRIPTION_PLAN_LABELS: Record<SubscriptionPlan, string> = {
  [SubscriptionPlan.SOLO]: 'BOBAPOS Solo',
  [SubscriptionPlan.STANDARD]: 'BOBAPOS Store',
  [SubscriptionPlan.PREMIUM]: 'BOBAPOS Chain',
};
