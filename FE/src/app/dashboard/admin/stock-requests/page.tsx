'use client';

import { AdminLayout } from '@/views/admin/AdminLayout';
import { StockRequestsPanel } from '@/views/shared/StockRequestsPanel';

export default function AdminStockRequestsPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Duyệt phiếu xin nhập / xuất kho</h1>
      <p className="mt-1 text-sm text-stone-500">
        Admin có thể duyệt thay kế toán khi cần
      </p>
      <div className="mt-6">
        <StockRequestsPanel />
      </div>
    </AdminLayout>
  );
}
