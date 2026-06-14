'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND, BRAND_COVER } from '@/lib/brand';
import { MarketingShell } from './MarketingShell';

const STATS = [
  { value: '7 ngày', label: 'Trial Premium' },
  { value: '6 vai trò', label: 'POS · Bếp · Kho' },
  { value: '4 kho', label: 'KHO_TONG + KHO1–3' },
  { value: 'SaaS', label: 'Multi-tenant' },
];

const PERSONAS = [
  {
    title: 'Chuỗi / đa chi nhánh',
    desc: 'Nhiều điểm bán, đội ngũ thu ngân · bếp · kho · kế toán. Quản lý tập trung.',
    plan: 'Premium',
    accent: 'from-violet-500/8 to-white border-violet-200/60',
  },
  {
    title: 'Quán nhỏ / một mình',
    desc: 'POS, phiếu bếp, kho nguyên liệu & công thức — đủ vận hành như Tendoo hộ kinh doanh.',
    plan: 'Solo · 99k',
    accent: 'from-blue-500/8 to-white border-blue-200/60',
  },
];

const FEATURES = [
  { title: 'POS & Thu ngân', desc: 'Ca làm việc, thu ngân / phục vụ, in hóa đơn, đồng bộ bếp.' },
  { title: 'Bếp (KDS)', desc: 'PENDING → PREPARING → READY, trừ nguyên liệu theo công thức.' },
  { title: 'Quản lý kho', desc: 'Cấp phát ca, hoàn trả, bổ sung tồn, nhập NCC, duyệt phiếu.' },
  { title: 'Kế toán', desc: 'Sao kê tháng, phiếu NCC, đối chiếu cấp — hoàn — tiêu hao.' },
  { title: 'Báo cáo', desc: 'Doanh thu theo ca, tồn thấp, phiếu chờ duyệt.' },
  { title: 'Multi-tenant', desc: 'Mỗi cửa hàng dữ liệu riêng, gói Standard/Premium.' },
];

const ROLES = ['Chủ quán', 'Thu ngân', 'Bếp', 'Kho', 'Kế toán', 'Quản lý ca'];

const STEPS = [
  { n: '01', title: 'Đăng ký cửa hàng', desc: 'Chọn mô hình — trial Premium 7 ngày.' },
  { n: '02', title: 'Thêm nhân viên', desc: 'Username + slug — phân quyền theo vai trò.' },
  { n: '03', title: 'Vận hành', desc: 'Bán hàng, duyệt kho, theo dõi doanh thu ca.' },
];

export function LandingView() {
  return (
    <MarketingShell active="home">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(47,128,237,0.14),transparent)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${BRAND.primarySoft}`}
            >
              Quản lý quán trà sữa · SaaS
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-stone-900 sm:text-5xl">
              Vận hành quán
              <span className={`block ${BRAND.primaryText}`}>từ quầy đến kho</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-600">
              <strong>BOBAPOS</strong> gộp POS, bếp, kho và kế toán — dù bạn mở chuỗi hay quán nhỏ.
              Dùng thử Premium <strong>7 ngày</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className={`rounded-2xl px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 ${BRAND.primary}`}
              >
                Bắt đầu miễn phí
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-stone-200 bg-white px-7 py-3.5 text-sm font-bold text-stone-800 shadow-sm hover:bg-stone-50"
              >
                Đăng nhập
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-stone-200/70 bg-white/90 p-3 shadow-sm backdrop-blur-sm"
                >
                  <p className={`text-base font-bold ${BRAND.primaryText}`}>{s.value}</p>
                  <p className="mt-0.5 text-[11px] text-stone-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#2F80ED]/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-2xl shadow-slate-900/10">
              <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50/80 px-5 py-3">
                <BrandLogo size={22} showName={false} />
                <span className="text-xs font-medium text-stone-600">BOBAPOS Dashboard</span>
              </div>
              <div className="relative aspect-[4/3]">
                <Image src={BRAND_COVER} alt="BOBAPOS" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-sm font-semibold">Trà sữa matcha · 38.000đ</p>
                  <p className="text-xs text-white/75">Đơn #1024 · Bếp READY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200/60 bg-white/60 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900">Hai mô hình kinh doanh</h2>
          <p className="mt-2 text-center text-stone-500">Chọn đúng quy mô khi đăng ký</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PERSONAS.map((p) => (
              <div
                key={p.title}
                className={`rounded-2xl border bg-gradient-to-br p-6 shadow-sm ${p.accent}`}
              >
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase text-stone-500">
                  Gợi ý {p.plan}
                </span>
                <h3 className="mt-3 text-lg font-bold text-stone-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900">Tính năng cốt lõi</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 h-1 w-8 rounded-full bg-[#2F80ED]" />
                <h3 className="font-bold text-stone-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-xl font-bold text-stone-900">6 vai trò — phân quyền rõ ràng</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {ROLES.map((r) => (
              <span
                key={r}
                className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900">Bắt đầu trong 3 bước</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm"
              >
                <span className={`text-2xl font-black ${BRAND.primaryText} opacity-40`}>{s.n}</span>
                <h3 className="mt-2 font-bold text-stone-900">{s.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div
          className={`overflow-hidden rounded-3xl bg-gradient-to-br ${BRAND.headerGradient} px-8 py-14 text-center text-white shadow-xl shadow-blue-900/20`}
        >
          <h2 className="text-2xl font-bold sm:text-3xl">Sẵn sàng với BOBAPOS?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            7 ngày Premium miễn phí · Menu & kho mẫu sẵn có
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-2xl bg-white px-8 py-3.5 font-bold text-[#2F80ED] shadow-lg"
            >
              Tạo cửa hàng miễn phí
            </Link>
            <Link href="/pricing" className="rounded-2xl border border-white/40 px-8 py-3.5 font-bold">
              Bảng giá
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
