'use client';

import Link from 'next/link';
import { InventoryPageHeader } from '@/views/inventory/inventory-ui';
import { WarehouseLayout } from './WarehouseLayout';

export function SupplierReceiptView() {
  return (
    <WarehouseLayout>
      <div className="space-y-6">
        <InventoryPageHeader
          theme="warehouse"
          badge="Thông tin"
          title="Nhập NCC — Kế toán thực hiện"
          subtitle="Phiếu nhà cung cấp chỉ được ghi vào kho tổng (KHO_TONG). Bạn lập phiếu xin chuyển kho sau khi hàng đã về kho tổng."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm">
            <span className="text-3xl">📥</span>
            <h2 className="mt-3 font-bold text-stone-900">Bước 1 — Kế toán</h2>
            <p className="mt-2 text-sm text-stone-600">
              Nhập hóa đơn NCC, chứng từ vào <strong>KHO_TONG</strong>
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
            <span className="text-3xl">📋</span>
            <h2 className="mt-3 font-bold text-stone-900">Bước 2 — Kho (bạn)</h2>
            <p className="mt-2 text-sm text-stone-600">
              Lập phiếu xin xuất kèm chứng từ xin phép → chờ kế toán duyệt
            </p>
            <Link
              href="/dashboard/warehouse/requests"
              className="mt-4 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Lập phiếu ngay →
            </Link>
          </div>
        </div>
      </div>
    </WarehouseLayout>
  );
}
