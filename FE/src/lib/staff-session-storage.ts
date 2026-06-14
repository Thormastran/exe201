import { getStoredUser } from '@/lib/auth-storage';
import { isStoreOwner } from '@/lib/role-access';
import { Role } from '@/models/user.model';
import { StaffSession, WorkRole, WorkShift } from '@/models/staff.model';

const SESSION_KEY = 'staff_session';

function ownerDefaultSession(workRole: WorkRole): StaffSession {
  return {
    workShift: WorkShift.MORNING,
    workRole,
    startedAt: new Date().toISOString(),
  };
}

export function saveStaffSession(session: StaffSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getStaffSession(): StaffSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StaffSession;
  } catch {
    return null;
  }
}

/**
 * Lấy session ca làm. Chủ cửa hàng (ADMIN) không cần setup — tự dùng ca mặc định.
 */
export function resolveStaffSession(requiredWorkRole?: WorkRole): StaffSession | null {
  const saved = getStaffSession();
  if (saved && (!requiredWorkRole || saved.workRole === requiredWorkRole)) {
    return saved;
  }

  const user = getStoredUser<{ role: Role }>();
  if (user && isStoreOwner(user.role) && requiredWorkRole) {
    return ownerDefaultSession(requiredWorkRole);
  }

  return saved;
}

export function clearStaffSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
