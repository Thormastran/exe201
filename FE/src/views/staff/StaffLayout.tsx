'use client';



import { ReactNode } from 'react';

import { Role } from '@/models/user.model';

import { AppShellLayout, type NavItem } from '@/views/components/AppShellLayout';



const NAV: NavItem[] = [

  { href: '/dashboard/staff/setup', label: 'Chọn ca / vai trò', icon: '⏱️' },

  { href: '/dashboard/staff/cashier', label: 'Thu ngân', icon: '💳' },

  { href: '/dashboard/staff/cashier/orders', label: 'Đơn thu ngân', icon: '📋' },

  { href: '/dashboard/staff/server', label: 'Phục vụ', icon: '🍽️' },

];



export function StaffLayout({

  children,

  compact,

}: {

  children: ReactNode;

  compact?: boolean;

}) {

  return (

    <AppShellLayout

      allowedRoles={[Role.STAFF, Role.ADMIN]}

      roleBadge="Bán hàng"

      navItems={NAV}

      mainClassName={

        compact

          ? 'min-w-0 flex-1 overflow-auto p-0'

          : 'min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8'

      }

    >

      {children}

    </AppShellLayout>

  );

}


