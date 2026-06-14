'use client';

import { AdminLayout } from '@/views/admin/AdminLayout';
import { LedgerPanel } from '@/views/shared/LedgerPanel';

export default function AdminLedgerPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Sao kê chứng từ</h1>
      <p className="mt-1 text-sm text-stone-500">Tổng hợp NCC + phiếu kho theo tháng</p>
      <div className="mt-6">
        <LedgerPanel />
      </div>
    </AdminLayout>
  );
}
