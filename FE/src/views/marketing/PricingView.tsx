'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PublicController } from '@/controllers/public.controller';
import { BRAND } from '@/lib/brand';

type Plan = {
  id: string;
  name: string;
  priceMonthly: number;
  maxEmployees: number;
  maxBranches: number;
  features: string[];
};

export function PricingView() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [trialDays, setTrialDays] = useState(7);

  useEffect(() => {
    PublicController.getPlans()
      .then((res) => {
        setPlans(res.plans);
        setTrialDays(res.trialDays);
      })
      .catch(() => {});
  }, []);

  return (
    <div className={`min-h-screen ${BRAND.pageBg}`}>
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className={`text-xl font-bold ${BRAND.primaryText}`}>
            BOBAPOS
          </Link>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm font-medium text-stone-600">
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${BRAND.primary}`}
            >
              Dùng thử {trialDays} ngày
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-center text-3xl font-bold">Bảng giá BOBAPOS</h1>
        <p className="mt-2 text-center text-stone-600">
          Dùng thử Premium miễn phí {trialDays} ngày — không cần thẻ tín dụng
        </p>

        <div className={`mt-10 grid gap-6 ${plans.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border bg-white p-8 shadow-sm ${
                plan.id === 'PREMIUM' ? 'border-[#2F80ED] ring-2 ring-[#2F80ED]/20' : ''
              }`}
            >
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold text-stone-900">
                {plan.priceMonthly.toLocaleString('vi-VN')}
                <span className="text-base font-normal text-stone-500"> đ/tháng</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-stone-600">
                <li>• Tối đa {plan.maxEmployees} nhân viên</li>
                <li>• Tối đa {plan.maxBranches} chi nhánh</li>
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 block rounded-xl py-3 text-center font-semibold text-white ${
                  plan.id === 'PREMIUM' ? BRAND.primary : 'bg-stone-800 hover:bg-stone-900'
                }`}
              >
                Bắt đầu dùng thử
              </Link>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <PlanFallback
              name="BOBAPOS Solo"
              price={99_000}
              employees={1}
              branches={1}
              highlight={false}
              bullets={['POS, bếp KDS, kho & công thức', 'Báo cáo doanh thu cơ bản']}
            />
            <PlanFallback
              name="BOBAPOS Store"
              price={299_000}
              employees={10}
              branches={1}
              highlight={false}
              bullets={['Toàn bộ Solo + nhân viên & ca', 'Kế toán & duyệt phiếu']}
            />
            <PlanFallback
              name="BOBAPOS Chain"
              price={599_000}
              employees={9999}
              branches={9999}
              highlight
              bullets={['Đa chi nhánh', 'CRM & báo cáo nâng cao']}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function PlanFallback({
  name,
  price,
  employees,
  branches,
  highlight,
  bullets = [],
}: {
  name: string;
  price: number;
  employees: number;
  branches: number;
  highlight: boolean;
  bullets?: string[];
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-8 shadow-sm ${
        highlight ? 'border-[#2F80ED] ring-2 ring-[#2F80ED]/20' : ''
      }`}
    >
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="mt-2 text-3xl font-bold">
        {price.toLocaleString('vi-VN')}
        <span className="text-base font-normal text-stone-500"> đ/tháng</span>
      </p>
      <ul className="mt-6 space-y-2 text-sm text-stone-600">
        <li>• Tối đa {employees} nhân viên</li>
        <li>• Tối đa {branches} chi nhánh</li>
        {bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
      <Link
        href="/register"
        className={`mt-8 block rounded-xl py-3 text-center font-semibold text-white ${
          highlight ? BRAND.primary : 'bg-stone-800'
        }`}
      >
        Bắt đầu dùng thử
      </Link>
    </div>
  );
}
