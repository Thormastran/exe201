'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BillingController } from '@/controllers/billing.controller';
import { BRAND } from '@/lib/brand';
import { BillingInvoice, SubscriptionPlan } from '@/models/tenant.model';
import { AdminLayout } from './AdminLayout';

export function BillingManageView() {
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan>(SubscriptionPlan.STANDARD);
  const [months, setMonths] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await BillingController.listInvoices();
      setInvoices(data);
    } catch {
      setMessage('Không tải được hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCheckout = async () => {
    setBusy(true);
    setMessage('');
    try {
      const inv = await BillingController.checkout(checkoutPlan, months);
      setMessage(`Đã tạo hóa đơn ${inv.id.slice(-8).toUpperCase()} — thanh toán chuyển khoản (demo).`);
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Tạo hóa đơn thất bại');
    } finally {
      setBusy(false);
    }
  };

  const handleConfirmPaid = async (id: string) => {
    setBusy(true);
    setMessage('');
    try {
      await BillingController.confirmPaid(id);
      setMessage('Đã xác nhận thanh toán — gói được kích hoạt.');
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Xác nhận thất bại');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Thanh toán & hóa đơn</h1>
      <p className="mt-1 text-stone-500">
        Gia hạn gói BOBAPOS · Demo: tạo hóa đơn rồi bấm xác nhận đã thanh toán
      </p>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Tạo hóa đơn mới</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <select
            value={checkoutPlan}
            onChange={(e) => setCheckoutPlan(e.target.value as SubscriptionPlan)}
            className="rounded-xl border px-3 py-2"
          >
            <option value={SubscriptionPlan.STANDARD}>Standard</option>
            <option value={SubscriptionPlan.PREMIUM}>Premium</option>
          </select>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="rounded-xl border px-3 py-2"
          >
            {[1, 3, 6, 12].map((m) => (
              <option key={m} value={m}>
                {m} tháng
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy}
            onClick={handleCheckout}
            className={`rounded-xl px-5 py-2 text-sm font-semibold text-white ${BRAND.primary}`}
          >
            Tạo hóa đơn
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-4 rounded-xl bg-stone-100 px-4 py-3 text-sm">{message}</p>
      )}

      <div className="mt-8">
        <h2 className="font-semibold">Lịch sử hóa đơn</h2>
        {loading ? (
          <p className="mt-4 text-stone-500">Đang tải...</p>
        ) : invoices.length === 0 ? (
          <p className="mt-4 text-stone-500">Chưa có hóa đơn</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-stone-50 text-left">
                <tr>
                  <th className="px-4 py-3">Gói</th>
                  <th className="px-4 py-3">Số tiền</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{inv.plan}</td>
                    <td className="px-4 py-3">
                      {inv.amount.toLocaleString('vi-VN')} {inv.currency}
                    </td>
                    <td className="px-4 py-3">{inv.status}</td>
                    <td className="px-4 py-3 text-stone-500">
                      {inv.createdAt
                        ? new Date(inv.createdAt).toLocaleDateString('vi-VN')
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {inv.status === 'PENDING' && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleConfirmPaid(inv.id)}
                          className={`rounded-lg px-3 py-1 text-xs font-semibold text-white ${BRAND.primary}`}
                        >
                          Xác nhận đã TT
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-stone-500">
        <Link href="/dashboard/admin/subscription" className={BRAND.primaryText}>
          ← Quay lại quản lý gói
        </Link>
      </p>
    </AdminLayout>
  );
}
