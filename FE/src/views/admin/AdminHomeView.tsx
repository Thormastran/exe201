'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  getStoredPlan,
  getStoredSubscription,
  getSubscriptionStatus,
} from '@/lib/auth-storage';
import { planHasFeature } from '@/lib/plan-features';
import { SaasFeature } from '@/models/saas-feature.model';
import { SubscriptionPlan } from '@/models/tenant.model';
import { SubscriptionCard } from '@/views/subscription/SubscriptionCard';
import { AdminLayout } from './AdminLayout';

type ActionCard = {
  href: string;
  title: string;
  desc: string;
  feature?: SaasFeature;
};

const QUICK_ACTIONS: ActionCard[] = [
  {
    href: '/dashboard/staff/cashier',
    title: 'Mở POS thu ngân',
    desc: 'Bán hàng, thanh toán, in hóa đơn',
    feature: SaasFeature.POS,
  },
  {
    href: '/dashboard/kitchen/orders',
    title: 'Màn hình bếp',
    desc: 'Xử lý đơn PENDING → READY',
    feature: SaasFeature.KITCHEN,
  },
  {
    href: '/dashboard/manager/orders',
    title: 'Đơn theo ca',
    desc: 'Theo dõi doanh thu & trạng thái',
    feature: SaasFeature.SHIFT_MGMT,
  },
  {
    href: '/dashboard/admin/menu',
    title: 'Quản lý menu',
    desc: 'Món, giá, topping',
    feature: SaasFeature.MENU,
  },
];

const SECTIONS: { title: string; cards: ActionCard[] }[] = [
  {
    title: 'Vận hành hàng ngày',
    cards: [
      {
        href: '/dashboard/staff/setup',
        title: 'Chọn ca',
        desc: 'Ca sáng / trưa / chiều / tối',
        feature: SaasFeature.SHIFT_MGMT,
      },
      {
        href: '/dashboard/staff/cashier',
        title: 'Thu ngân',
        desc: 'POS bán hàng',
        feature: SaasFeature.POS,
      },
      {
        href: '/dashboard/staff/server',
        title: 'Phục vụ',
        desc: 'Giao món READY',
        feature: SaasFeature.POS,
      },
      {
        href: '/dashboard/kitchen/orders',
        title: 'Bếp KDS',
        desc: 'Chế biến đơn',
        feature: SaasFeature.KITCHEN,
      },
      {
        href: '/dashboard/manager/issue',
        title: 'Cấp phát ca',
        desc: 'Xuất kho đầu ca',
        feature: SaasFeature.SHIFT_MGMT,
      },
      {
        href: '/dashboard/manager/returns',
        title: 'Hoàn trả ca',
        desc: 'Thu hồi cuối ca',
        feature: SaasFeature.SHIFT_MGMT,
      },
    ],
  },
  {
    title: 'Kho & kế toán',
    cards: [
      {
        href: '/dashboard/warehouse/stock',
        title: 'Tồn kho',
        desc: 'Theo từng kho',
        feature: SaasFeature.WAREHOUSE,
      },
      {
        href: '/dashboard/accounting/supplier',
        title: 'Nhập NCC',
        desc: 'Vào kho tổng',
        feature: SaasFeature.ACCOUNTING,
      },
      {
        href: '/dashboard/accounting/requests',
        title: 'Duyệt phiếu',
        desc: 'Phê duyệt xuất/nhập',
        feature: SaasFeature.ACCOUNTING,
      },
      {
        href: '/dashboard/admin/recipes',
        title: 'Công thức',
        desc: 'Định lượng món',
        feature: SaasFeature.RECIPE,
      },
    ],
  },
  {
    title: 'Cấu hình & nhân sự',
    cards: [
      {
        href: '/dashboard/admin/menu',
        title: 'Menu',
        desc: 'Món và giá bán',
        feature: SaasFeature.MENU,
      },
      {
        href: '/dashboard/admin/employees',
        title: 'Nhân viên',
        desc: 'Tài khoản & phân quyền',
        feature: SaasFeature.EMPLOYEES,
      },
      {
        href: '/dashboard/admin/warehouses',
        title: 'Cấu hình kho',
        desc: 'KHO_TONG, KHO1–3',
        feature: SaasFeature.WAREHOUSE,
      },
      { href: '/dashboard/admin/subscription', title: 'Gói BOBAPOS', desc: 'Solo / Store / Chain' },
    ],
  },
];

function filterCards(cards: ActionCard[], plan: string, status: string) {
  return cards.filter((c) => !c.feature || planHasFeature(plan, status, c.feature));
}

export function AdminHomeView() {
  const sub = getStoredSubscription<{ plan?: string }>();
  const plan = getStoredPlan() ?? sub?.plan ?? SubscriptionPlan.STANDARD;
  const status = getSubscriptionStatus() ?? 'ACTIVE';

  const quickActions = useMemo(
    () => filterCards(QUICK_ACTIONS, plan, status),
    [plan, status],
  );

  const sections = useMemo(
    () =>
      SECTIONS.map((s) => ({
        ...s,
        cards: filterCards(s.cards, plan, status),
      })).filter((s) => s.cards.length > 0),
    [plan, status],
  );

  const isSolo = plan === SubscriptionPlan.SOLO && status !== 'TRIAL';

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Xin chào, chủ cửa hàng</h1>
        <p className="mt-1 text-stone-500">
          {isSolo
            ? 'Gói Solo — đủ POS, bếp, kho & công thức cho chủ tự vận hành. Nâng cấp Store để thêm nhân viên, ca và kế toán.'
            : 'BOBAPOS — bán hàng, bếp, kho và kế toán trên một hệ thống.'}
        </p>

        {quickActions.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#2F80ED]/30 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <h3 className="font-semibold text-stone-900 group-hover:text-[#2F80ED]">{a.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">{a.desc}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6">
          <SubscriptionCard />
        </div>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {section.title}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.cards.map((card) => (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="rounded-2xl border border-stone-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition duration-200 hover:border-[#2F80ED]/25 hover:shadow-md"
                  >
                    <h3 className="font-semibold text-stone-800">{card.title}</h3>
                    <p className="mt-1 text-sm text-stone-500">{card.desc}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
