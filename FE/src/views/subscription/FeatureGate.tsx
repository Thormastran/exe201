'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {
  getStoredPlan,
  getStoredSubscription,
  getSubscriptionStatus,
} from '@/lib/auth-storage';
import { planLabel, planHasFeature, requiredPlanForFeature } from '@/lib/plan-features';
import { getRequiredFeatureForPath } from '@/lib/route-features';
import { SaasFeature } from '@/models/saas-feature.model';
import { SubscriptionPlan } from '@/models/tenant.model';

const FEATURE_NAMES: Partial<Record<SaasFeature, string>> = {
  [SaasFeature.KITCHEN]: 'Màn hình bếp (KDS)',
  [SaasFeature.WAREHOUSE]: 'Quản lý kho',
  [SaasFeature.RECIPE]: 'Công thức món',
  [SaasFeature.SHIFT_MGMT]: 'Quản lý ca & phân ca',
  [SaasFeature.ACCOUNTING]: 'Kế toán & duyệt phiếu',
  [SaasFeature.EMPLOYEES]: 'Quản lý nhân viên',
  [SaasFeature.POS]: 'POS bán hàng',
  [SaasFeature.MENU]: 'Quản lý menu',
};

function UpgradeCard({
  feature,
  currentPlan,
}: {
  feature: SaasFeature;
  currentPlan: string;
}) {
  const needed = requiredPlanForFeature(feature);
  const featureName = FEATURE_NAMES[feature] ?? 'Tính năng này';

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-lg shadow-stone-200/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#2F80ED]">
          Nâng cấp gói
        </p>
        <h2 className="mt-2 text-xl font-bold text-stone-900">{featureName}</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-500">
          Gói hiện tại của bạn là{' '}
          <span className="font-medium text-stone-800">{planLabel(currentPlan)}</span>. Tính năng
          này có trong gói{' '}
          <span className="font-medium text-[#2F80ED]">{planLabel(needed)}</span> trở lên.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/admin/subscription"
            className="rounded-xl bg-[#2F80ED] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:bg-[#2563c7]"
          >
            Xem gói & nâng cấp
          </Link>
          <Link
            href="/dashboard/admin"
            className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
          >
            Về Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FeatureGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sub = getStoredSubscription<{ plan?: string }>();
  const plan = getStoredPlan() ?? sub?.plan ?? SubscriptionPlan.STANDARD;
  const status = getSubscriptionStatus() ?? 'ACTIVE';
  const required = getRequiredFeatureForPath(pathname);

  if (!required || planHasFeature(plan, status, required)) {
    return <>{children}</>;
  }

  return <UpgradeCard feature={required} currentPlan={plan} />;
}
