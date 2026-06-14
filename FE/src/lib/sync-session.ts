import { AuthController } from '@/controllers/auth.controller';
import { getToken, getStoredUser, saveAuth } from '@/lib/auth-storage';

/** Đồng bộ trial/subscription từ BE vào localStorage */
export async function syncSessionFromServer(): Promise<boolean> {
  if (!getToken()) return false;
  const user = getStoredUser();
  if (!user) return false;

  try {
    const session = await AuthController.getSession();
    saveAuth(getToken()!, user, {
      tenant: session.tenant,
      subscription: session.subscription,
      trialDaysLeft: session.trialDaysLeft,
      plan: session.plan,
      status: session.status,
    });
    return true;
  } catch {
    return false;
  }
}
