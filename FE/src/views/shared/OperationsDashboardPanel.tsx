'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { InventoryController } from '@/controllers/inventory.controller';
import { OperationsDashboard } from '@/models/stock-request.model';
import { usePolling } from '@/lib/use-polling';
import { StatCard } from '@/views/inventory/inventory-ui';

export function OperationsDashboardPanel({
  warehouseHref,
  accountingHref,
}: {
  warehouseHref: string;
  accountingHref: string;
}) {
  const [data, setData] = useState<OperationsDashboard | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await InventoryController.getOperationsDashboard());
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  usePolling(load, 20_000);

  if (!data) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-stone-600">
          Vận hành trong ngày · {data.businessDate}
        </h2>
        <div className="flex gap-2 text-sm">
          <Link href={warehouseHref} className="font-medium text-blue-600 hover:underline">
            Kho →
          </Link>
          <Link href={accountingHref} className="font-medium text-blue-600 hover:underline">
            Kế toán →
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Chờ kế toán duyệt"
          value={data.pendingApproval}
          icon="⏳"
          tone="warning"
        />
        <StatCard
          label="Cấp phát chờ hoàn trả"
          value={data.needsEndOfDayReturn}
          icon="📤"
          tone="info"
          hint="Cuối ca phải lập phiếu hoàn trả"
        />
        <StatCard
          label="Hoàn trả chờ duyệt"
          value={data.pendingReturnsToday}
          icon="📥"
        />
        <StatCard
          label="Quá hạn hoàn trả"
          value={data.overdueOpenIssues}
          icon="⚠️"
          tone={data.overdueOpenIssues > 0 ? 'warning' : 'default'}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm">
          <p className="font-semibold text-blue-900">Luồng trong ngày</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-blue-800/90">
            <li>Sáng/ca: lập phiếu <strong>cấp phát</strong> (KHO_TONG → KHO1/2/3)</li>
            <li>Kế toán duyệt → quầy nhận nguyên liệu</li>
            <li>Cuối ca: lập phiếu <strong>hoàn trả</strong> gắn đúng mã phiếu cấp phát</li>
            <li>Kế toán duyệt → tồn về kho tổng, đóng phiếu ngày</li>
          </ol>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm">
          <p className="font-semibold text-stone-800">Hôm nay đã xử lý</p>
          <p className="mt-2 text-stone-600">
            Cấp phát: <strong>{data.completedIssuesToday}</strong> phiếu
          </p>
          <p className="text-stone-600">
            Hoàn trả: <strong>{data.completedReturnsToday}</strong> phiếu
          </p>
          <p className="mt-2 text-xs text-stone-500">
            Một phần: {data.partialIssuesToday} phiếu cấp phát đang hoàn trả dở
          </p>
        </div>
      </div>
    </section>
  );
}
