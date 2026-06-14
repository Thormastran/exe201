'use client';

import { ReactNode } from 'react';
import { Role } from '@/models/user.model';
import { OWNER_NAV_SECTIONS } from '@/lib/dashboard-nav';
import { AppShellLayout } from '@/views/components/AppShellLayout';

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShellLayout
      allowedRole={Role.ADMIN}
      roleBadge="Chủ cửa hàng"
      ownerNavSections={OWNER_NAV_SECTIONS}
      navSections={OWNER_NAV_SECTIONS}
    >
      {children}
    </AppShellLayout>
  );
}
