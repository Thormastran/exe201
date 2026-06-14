'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/auth-storage';
import { isStoreOwner } from '@/lib/role-access';
import { getStaffSession, resolveStaffSession } from '@/lib/staff-session-storage';
import { WorkRole } from '@/models/staff.model';
import { STAFF_ROUTES } from '@/models/staff.model';

export function StaffHubView() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser<{ role: string }>();
    const session =
      getStaffSession() ??
      (isStoreOwner(user?.role) ? resolveStaffSession(WorkRole.CASHIER) : null);
    if (!session) {
      router.replace('/dashboard/staff/setup');
      return;
    }
    router.replace(STAFF_ROUTES[session.workRole]);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-stone-500">
      Đang chuyển hướng...
    </div>
  );
}
