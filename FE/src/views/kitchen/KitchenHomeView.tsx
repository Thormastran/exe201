'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { usePolling } from '@/lib/use-polling';
import { BRAND } from '@/lib/brand';
import { OrderController } from '@/controllers/order.controller';
import { normalizeStatus, OrderStatus } from '@/models/order.model';
import { KitchenLayout } from './KitchenLayout';

export function KitchenHomeView() {
  const [counts, setCounts] = useState({
    pending: 0,
    preparing: 0,
    ready: 0,
  });

  const load = useCallback(async () => {
    try {
      const orders = await OrderController.getToday(undefined, true);
      const active = orders.filter(
        (o) => normalizeStatus(o.status) !== OrderStatus.CANCELLED,
      );
      setCounts({
        pending: active.filter(
          (o) => normalizeStatus(o.status) === OrderStatus.PENDING,
        ).length,
        preparing: active.filter(
          (o) => normalizeStatus(o.status) === OrderStatus.PREPARING,
        ).length,
        ready: active.filter(
          (o) => normalizeStatus(o.status) === OrderStatus.READY,
        ).length,
      });
    } catch {
      /* ignore */
    }
  }, []);

  usePolling(load, 12_000);

  return (
    <KitchenLayout>
      <div
        className={`rounded-2xl bg-gradient-to-r ${BRAND.headerGradient} p-6 text-white shadow-lg`}
      >
        <h1 className="text-2xl font-bold">Dashboard Bếp</h1>
        <p className="mt-2 text-sm text-white/85">
          Khi chuyển đơn sang <strong>Đã hoàn thành</strong>, hệ thống tự trừ kho theo
          công thức (ml mỗi ly).
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-800">Chưa thực hiện</p>
          <p className="text-3xl font-bold text-amber-900">{counts.pending}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs text-blue-800">Đang thực hiện</p>
          <p className="text-3xl font-bold text-blue-900">{counts.preparing}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs text-emerald-800">Đã hoàn thành (đã trừ kho)</p>
          <p className="text-3xl font-bold text-emerald-900">{counts.ready}</p>
        </div>
      </div>

      <Link
        href="/dashboard/kitchen/orders"
        className={`mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white shadow-sm ${BRAND.primary}`}
      >
        🍳 Mở danh sách đơn bếp
      </Link>

      <div className="mt-10 rounded-xl border border-stone-200 bg-white p-5 text-sm text-stone-600">
        <p className="font-medium text-stone-800">Quy trình trừ nguyên liệu</p>
        <ol className="mt-2 list-inside list-decimal space-y-1">
          <li>Admin thiết lập công thức từng món (ml sữa, ml trà, g đường…)</li>
          <li>Bếp: Đang thực hiện → Đã hoàn thành</li>
          <li>Kho thấy tồn giảm trên dashboard Tồn kho (realtime)</li>
        </ol>
      </div>
    </KitchenLayout>
  );
}
