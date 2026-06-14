'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { getStoredUser } from '@/lib/auth-storage';
import { BRAND } from '@/lib/brand';
import { DASHBOARD_ROUTES, Role, User } from '@/models/user.model';

export function MarketingShell({
  children,
  active,
}: {
  children: ReactNode;
  active?: 'home' | 'pricing' | 'login' | 'register';
}) {
  const [dashboardHref, setDashboardHref] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser<User>();
    if (user?.role) setDashboardHref(DASHBOARD_ROUTES[user.role as Role]);
  }, []);

  const navLink = (href: string, key: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium transition ${
        active === key
          ? `${BRAND.primaryText} font-semibold`
          : 'text-stone-600 hover:text-stone-900'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className={`min-h-screen ${BRAND.pageBg}`}>
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/">
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLink('/', 'home', 'Trang chủ')}
            {navLink('/pricing', 'pricing', 'Bảng giá')}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {dashboardHref ? (
              <Link
                href={dashboardHref}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md ${BRAND.primary}`}
              >
                Vào bảng điều khiển
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-xl px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100 sm:inline-block"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md ${BRAND.primary}`}
                >
                  Dùng thử 7 ngày
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
          <div className="md:col-span-2">
            <BrandLogo />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600">
              BOBAPOS — POS, bếp, kho, kế toán trên một hệ thống SaaS cho quán trà sữa.
              Dùng thử Premium 7 ngày.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Sản phẩm
            </p>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/pricing" className="hover:text-[#2F80ED]">
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#2F80ED]">
                  Đăng ký cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#2F80ED]">
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-100 py-6 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} BOBAPOS · EXE201
        </div>
      </footer>
    </div>
  );
}
