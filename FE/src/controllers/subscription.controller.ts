import { apiRequest } from '@/lib/api';
import { SubscriptionInfo, TenantInfo } from '@/models/tenant.model';
import { SubscriptionPlan } from '@/models/tenant.model';

export const SubscriptionController = {
  get() {
    return apiRequest<{
      tenant: TenantInfo;
      subscription: SubscriptionInfo;
      trialDaysLeft: number;
      daysLeft: number;
      usage: { employees: number; maxEmployees: number; maxBranches: number };
    }>('/subscription', { auth: true });
  },

  upgrade(plan: SubscriptionPlan) {
    return apiRequest('/subscription/upgrade', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ plan }),
    });
  },
};
