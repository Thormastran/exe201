import { apiRequest } from '@/lib/api';
import { saveAuth, clearAuth } from '@/lib/auth-storage';
import {
  AuthResponse,
  CreateEmployeePayload,
  LoginPayload,
  User,
} from '@/models/user.model';

export const AuthController = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    saveAuth(response.accessToken, response.user, {
      tenant: response.tenant,
      subscription: response.subscription,
      trialDaysLeft: response.trialDaysLeft,
      plan: response.plan,
      status: response.status,
    });
    return response;
  },

  logout() {
    clearAuth();
  },

  async getProfile(): Promise<User> {
    return apiRequest<User>('/users/me', { auth: true });
  },

  async getSession() {
    return apiRequest<{
      tenant: object;
      subscription: object;
      trialDaysLeft: number;
      daysLeft: number;
      plan: string;
      status: string;
    }>('/auth/session', { auth: true });
  },
};

export const UserController = {
  async createEmployee(payload: CreateEmployeePayload): Promise<User> {
    return apiRequest<User>('/users', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  async getEmployees(): Promise<User[]> {
    return apiRequest<User[]>('/users', { auth: true });
  },
};
