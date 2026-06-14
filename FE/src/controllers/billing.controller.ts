import { apiRequest } from '@/lib/api';
import { invalidateCache } from '@/lib/api-cache';
import { BillingInvoice } from '@/models/tenant.model';
import { SubscriptionPlan } from '@/models/tenant.model';

export const BillingController = {
  listInvoices() {
    return apiRequest<BillingInvoice[]>('/billing/invoices', { auth: true });
  },

  checkout(plan: SubscriptionPlan, months = 1) {
    invalidateCache('GET:/subscription');
    return apiRequest<BillingInvoice>('/billing/checkout', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ plan, months }),
    });
  },

  confirmPaid(invoiceId: string) {
    invalidateCache('GET:/subscription');
    invalidateCache('GET:/billing');
    return apiRequest(`/billing/invoices/${invoiceId}/confirm-paid`, {
      method: 'POST',
      auth: true,
    });
  },
};
