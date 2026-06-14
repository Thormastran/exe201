import { AsyncLocalStorage } from 'async_hooks';

export interface TenantStore {
  tenantId: string;
  plan: string;
  subscriptionStatus: string;
}

export const tenantStorage = new AsyncLocalStorage<TenantStore>();

export function getTenantStore(): TenantStore | undefined {
  return tenantStorage.getStore();
}

export function getTenantId(): string | undefined {
  return tenantStorage.getStore()?.tenantId;
}

export function withTenantFilter<T extends Record<string, unknown>>(
  filter: T,
  tenantId?: string,
): T & { tenantId: string } {
  const tid = tenantId ?? getTenantId();
  if (!tid) {
    return filter as T & { tenantId: string };
  }
  return { ...filter, tenantId: tid };
}
