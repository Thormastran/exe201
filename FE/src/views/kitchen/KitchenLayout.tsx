'use client';

import { ReactNode } from 'react';
import { Role } from '@/models/user.model';
import { AppShellLayout, type NavItem } from '@/views/components/AppShellLayout';

const NAV: NavItem[] = [
  { href: '/dashboard/kitchen', label: 'Tổng quan', icon: '🏠', exact: true },
  { href: '/dashboard/kitchen/orders', label: 'Đơn bếp', icon: '🍳' },
];

export function KitchenLayout({ children }: { children: ReactNode }) {
  return (
    <AppShellLayout
      allowedRoles={[Role.KITCHEN, Role.ADMIN]}
      roleBadge="Bếp"
      navItems={NAV}
    >
      {children}
    </AppShellLayout>
  );
}
