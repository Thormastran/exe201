'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { AuthController } from '@/controllers/auth.controller';
import { BRAND, BRAND_COVER } from '@/lib/brand';
import { DEMO_ACCOUNTS, DemoSegment, getDemoAccount } from '@/lib/demo-accounts';
import { DASHBOARD_ROUTES } from '@/models/user.model';

type LoginMode = 'owner' | 'staff';

export function LoginView() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>('owner');
  const [identifier, setIdentifier] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = (which: DemoSegment) => {
    const demo = getDemoAccount(which);
    setMode('owner');
    setIdentifier(demo.identifier);
    setPassword(demo.password);
    setStoreSlug('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await AuthController.login({
        identifier: identifier.trim(),
        password,
        storeSlug: mode === 'staff' ? storeSlug.trim() : undefined,
      });
      router.replace(DASHBOARD_ROUTES[user.role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen ${BRAND.pageBg}`}>
      {/* Left panel */}
      <div
        className={`relative hidden w-[48%] flex-col justify-between overflow-hidden bg-gradient-to-br ${BRAND.headerGradient} p-10 text-white lg:flex`}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-900/30 blur-3xl" />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white">
            <BrandLogo size={28} showName={false} />
            <span>← Trang chủ</span>
          </Link>
          <h1 className="mt-8 text-3xl font-extrabold leading-tight xl:text-4xl">
            Đăng nhập
            <br />
            cửa hàng của bạn
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100">
            Chủ quán dùng email. Nhân viên dùng username + mã cửa hàng (slug).
          </p>
        </div>

        <div className="relative space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Demo 3 phân khúc</p>
          {DEMO_ACCOUNTS.map((demo) => (
            <button
              key={demo.segment}
              type="button"
              onClick={() => fillDemo(demo.segment)}
              className="w-full rounded-2xl border border-white/20 bg-white/10 p-3.5 text-left backdrop-blur transition hover:bg-white/20"
            >
              <p className="text-sm font-bold">{demo.label}</p>
              <p className="mt-0.5 text-xs text-blue-100">{demo.description}</p>
            </button>
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
          <div className="relative aspect-[4/3]">
            <Image src={BRAND_COVER} alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent" />
            <p className="absolute bottom-3 left-3 right-3 text-xs text-white/90">
              POS · Bếp · Kho đồng bộ realtime
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className={`font-bold ${BRAND.primaryText}`}>
            ← BOBAPOS
          </Link>
          <Link href="/register" className={`text-sm font-semibold ${BRAND.primaryText}`}>
            Đăng ký
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-8">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <div className="mb-4">
                <BrandLogo size={48} showName={false} />
              </div>
              <h2 className="text-2xl font-bold text-stone-900">Chào mừng trở lại</h2>
              <p className="mt-1 text-sm text-stone-500">Chọn loại tài khoản và đăng nhập</p>
            </div>

            {/* Mobile demo chips */}
            <div className="mb-6 flex flex-col gap-2 lg:hidden">
              {DEMO_ACCOUNTS.map((demo) => (
                <button
                  key={demo.segment}
                  type="button"
                  onClick={() => fillDemo(demo.segment)}
                  className={`rounded-xl border px-3 py-2 text-left text-xs ${BRAND.primarySoft}`}
                >
                  <strong>{demo.label}</strong> — bấm để điền
                </button>
              ))}
            </div>

            <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-stone-100 p-1">
              {(['owner', 'staff'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                    mode === m
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {m === 'owner' ? '👔 Chủ cửa hàng' : '🧾 Nhân viên'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'owner' ? (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">Email</label>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className={`w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none ${BRAND.focusBorder} focus:ring-2 focus:ring-[#2F80ED]/20`}
                    placeholder="demo-store@bobapos.test"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className={`w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none ${BRAND.focusBorder} focus:ring-2 focus:ring-[#2F80ED]/20`}
                      placeholder="cashier1"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700">
                      Mã cửa hàng (slug)
                    </label>
                    <input
                      type="text"
                      value={storeSlug}
                      onChange={(e) => setStoreSlug(e.target.value)}
                      required
                      className={`w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none ${BRAND.focusBorder} focus:ring-2 focus:ring-[#2F80ED]/20`}
                      placeholder="demo-chain"
                    />
                    <p className="mt-1 text-xs text-stone-400">Chủ quán cung cấp mã này khi tạo NV</p>
                  </div>
                </>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={`w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none ${BRAND.focusBorder} focus:ring-2 focus:ring-[#2F80ED]/20`}
                  placeholder="••••••••"
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
                className={`w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition disabled:opacity-60 ${BRAND.primary}`}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-stone-500">
              Chưa có cửa hàng?{' '}
              <Link href="/register" className={`font-semibold ${BRAND.primaryText}`}>
                Đăng ký trial 7 ngày
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
