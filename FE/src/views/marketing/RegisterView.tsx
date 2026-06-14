'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { PublicController } from '@/controllers/public.controller';
import { saveAuth } from '@/lib/auth-storage';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND, BRAND_COVER } from '@/lib/brand';
import { BusinessModel } from '@/models/tenant.model';
import { DASHBOARD_ROUTES, Role } from '@/models/user.model';

const BENEFITS = [
  'Premium Trial 7 ngày — đủ tính năng',
  'Menu, kho, công thức mẫu tự seed',
  '6 vai trò: Admin, Staff, Bếp, Kho, KT, QL',
  'Không cần thẻ tín dụng',
];

export function RegisterView() {
  const router = useRouter();
  const [step, setStep] = useState<'model' | 'form'>('model');
  const [businessModel, setBusinessModel] = useState<BusinessModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
  });

  const pickModel = (m: BusinessModel) => {
    setBusinessModel(m);
    setStep('form');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!businessModel) return;
    setLoading(true);
    setError('');
    try {
      const res = await PublicController.register({ ...form, businessModel });
      saveAuth(res.accessToken, res.user, {
        tenant: res.tenant,
        subscription: res.subscription,
        trialDaysLeft: res.trialDaysLeft,
        plan: res.plan,
        status: res.status,
      });
      router.replace(DASHBOARD_ROUTES[res.user.role as Role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition ${BRAND.focusBorder} focus:ring-2 focus:ring-[#2F80ED]/20`;

  return (
    <div className={`flex min-h-screen ${BRAND.pageBg}`}>
      {/* Left — benefits */}
      <div
        className={`relative hidden w-[44%] flex-col justify-between overflow-hidden bg-gradient-to-br ${BRAND.headerGradient} p-10 text-white lg:flex`}
      >
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white">
            <BrandLogo size={28} showName={false} />
            <span>← Trang chủ</span>
          </Link>
          <h1 className="mt-10 text-3xl font-extrabold leading-tight">
            Mở cửa hàng
            <br />
            trên BOBAPOS
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100">
            Tạo tenant riêng, dùng thử Premium, bắt đầu bán hàng và quản lý kho ngay hôm nay.
          </p>
          <ul className="mt-8 space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-blue-50">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl ring-1 ring-white/20">
          <Image src={BRAND_COVER} alt="" fill className="object-cover" priority />
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between p-6 lg:justify-end">
          <Link href="/" className={`font-bold lg:hidden ${BRAND.primaryText}`}>
            ← BOBAPOS
          </Link>
          <p className="text-sm text-stone-500">
            Đã có tài khoản?{' '}
            <Link href="/login" className={`font-semibold ${BRAND.primaryText}`}>
              Đăng nhập
            </Link>
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  step === 'model' ? `${BRAND.primary} text-white` : 'bg-stone-200 text-stone-500'
                }`}
              >
                1
              </div>
              <div className="h-px flex-1 bg-stone-200" />
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  step === 'form' ? `${BRAND.primary} text-white` : 'bg-stone-200 text-stone-500'
                }`}
              >
                2
              </div>
            </div>

            <h2 className="text-2xl font-bold text-stone-900">
              {step === 'model' ? 'Chọn mô hình kinh doanh' : 'Thông tin cửa hàng'}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {step === 'model'
                ? 'Chúng tôi gợi ý gói phù hợp sau trial'
                : 'Premium Trial 7 ngày · Không cần thẻ'}
            </p>

            {step === 'model' ? (
              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={() => pickModel(BusinessModel.SMALL)}
                  className={`group w-full rounded-2xl border-2 p-5 text-left transition hover:shadow-md ${BRAND.primarySoft} border-[#2F80ED]/30`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">🏪</span>
                    <span className="rounded-full bg-[#2F80ED]/15 px-2 py-0.5 text-[10px] font-bold uppercase text-[#2F80ED]">
                      Phổ biến
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-bold text-stone-900">Quán nhỏ / 1 chi nhánh</p>
                  <p className="mt-1 text-sm text-stone-600">
                    1–10 nhân viên · Gợi ý <strong>Standard</strong> sau trial
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => pickModel(BusinessModel.LARGE)}
                  className="group w-full rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 text-left transition hover:border-violet-300 hover:shadow-md"
                >
                  <span className="text-2xl">🏢</span>
                  <p className="mt-3 text-lg font-bold text-stone-900">Chuỗi / đa chi nhánh</p>
                  <p className="mt-1 text-sm text-stone-600">
                    Mở rộng nhiều điểm · Gợi ý <strong>Premium</strong>
                  </p>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={() => setStep('model')}
                  className="text-sm text-stone-500 hover:text-[#2F80ED]"
                >
                  ← Đổi mô hình
                </button>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Tên cửa hàng *
                  </label>
                  <input
                    required
                    value={form.storeName}
                    onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                    className={inputClass}
                    placeholder="VD: Trà Sữa Giọt Nắng"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Họ tên chủ cửa hàng *
                  </label>
                  <input
                    required
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className={inputClass}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Email đăng nhập *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    placeholder="owner@yourstore.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Mật khẩu *
                  </label>
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={inputClass}
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>

                {error && (
                  <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 disabled:opacity-60 ${BRAND.primary}`}
                >
                  {loading ? 'Đang tạo cửa hàng...' : 'Tạo cửa hàng & bắt đầu trial'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
