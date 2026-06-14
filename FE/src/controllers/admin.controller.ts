import { apiRequest } from '@/lib/api';
import { MenuItem } from '@/models/menu.model';
import { CreateEmployeePayload, User } from '@/models/user.model';

export interface ToppingConfig {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  sortOrder: number;
}

export interface PaymentMethodConfig {
  id: string;
  code: string;
  label: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export const AdminMenuController = {
  getAll(): Promise<MenuItem[]> {
    return apiRequest<MenuItem[]>('/menu?forStaff=false', { auth: true });
  },

  create(payload: Partial<MenuItem> & { toppingIds?: string[] }): Promise<MenuItem> {
    return apiRequest<MenuItem>('/menu', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  update(
    id: string,
    payload: Partial<MenuItem> & { toppingIds?: string[] },
  ): Promise<MenuItem> {
    return apiRequest<MenuItem>(`/menu/${id}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  remove(id: string): Promise<void> {
    return apiRequest<void>(`/menu/${id}`, { method: 'DELETE', auth: true });
  },
};

export const AdminToppingController = {
  getAll(): Promise<ToppingConfig[]> {
    return apiRequest<ToppingConfig[]>('/toppings', { auth: true });
  },

  create(payload: {
    name: string;
    price: number;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<ToppingConfig> {
    return apiRequest<ToppingConfig>('/toppings', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  update(
    id: string,
    payload: Partial<{ name: string; price: number; isActive: boolean; sortOrder: number }>,
  ): Promise<ToppingConfig> {
    return apiRequest<ToppingConfig>(`/toppings/${id}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  remove(id: string): Promise<void> {
    return apiRequest<void>(`/toppings/${id}`, { method: 'DELETE', auth: true });
  },
};

export const AdminPaymentController = {
  getAll(): Promise<PaymentMethodConfig[]> {
    return apiRequest<PaymentMethodConfig[]>('/payment-methods', { auth: true });
  },

  create(payload: {
    code: string;
    label: string;
    description?: string;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<PaymentMethodConfig> {
    return apiRequest<PaymentMethodConfig>('/payment-methods', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  update(
    id: string,
    payload: Partial<PaymentMethodConfig>,
  ): Promise<PaymentMethodConfig> {
    return apiRequest<PaymentMethodConfig>(`/payment-methods/${id}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  remove(id: string): Promise<void> {
    return apiRequest<void>(`/payment-methods/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};

export const AdminUserController = {
  getAll(): Promise<User[]> {
    return apiRequest<User[]>('/users', { auth: true });
  },

  create(payload: CreateEmployeePayload): Promise<User> {
    return apiRequest<User>('/users', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  update(
    id: string,
    payload: Partial<CreateEmployeePayload> & { isActive?: boolean },
  ): Promise<User> {
    return apiRequest<User>(`/users/${id}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  remove(id: string): Promise<void> {
    return apiRequest<void>(`/users/${id}`, { method: 'DELETE', auth: true });
  },
};
