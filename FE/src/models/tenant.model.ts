export enum TenantStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

export enum SubscriptionPlan {
  SOLO = 'SOLO',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

export enum BusinessModel {
  SMALL = 'SMALL',
  LARGE = 'LARGE',
}

export interface TenantInfo {
  id: string;
  storeName: string;
  slug: string;
  businessModel: BusinessModel;
  packageType: SubscriptionPlan;
  status: TenantStatus;
  trialExpiredAt?: string;
  subscriptionExpiredAt?: string;
}

export interface SubscriptionInfo {
  id: string;
  tenantId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  maxEmployees: number;
  maxBranches: number;
}

export interface BillingInvoice {
  id: string;
  tenantId: string;
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt?: string;
}
