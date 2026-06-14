'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthController } from '@/controllers/auth.controller';
import { ROLE_LABELS, Role, User } from '@/models/user.model';

interface DashboardLayoutProps {
  user: User;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function DashboardLayout({
  user,
  title,
  description,
  children,
  actions,
}: DashboardLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    AuthController.logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <header className="border-b border-amber-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-medium text-amber-700">Bubble Tea Shop</p>
            <h1 className="text-xl font-bold text-stone-800">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-stone-800">{user.fullName}</p>
              <p className="text-xs text-stone-500">{ROLE_LABELS[user.role as Role]}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700 transition hover:bg-stone-100"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-800">{title}</h2>
            <p className="mt-1 text-stone-600">{description}</p>
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
