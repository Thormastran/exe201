'use client';

import { useCallback, useEffect, useState } from 'react';
import { InventoryController } from '@/controllers/inventory.controller';
import { SupplierReceipt } from '@/models/inventory.model';
import { AdminLayout } from '@/views/admin/AdminLayout';
import { SupplierReceiptForm, SupplierReceiptList } from '@/views/shared/SupplierReceiptForm';

export default function AdminSupplierPage() {
  const [receipts, setReceipts] = useState<SupplierReceipt[]>([]);

  const load = useCallback(async () => {
    setReceipts(await InventoryController.getSupplierReceipts());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Nhập NCC → Kho tổng</h1>
      <p className="mt-1 text-sm text-stone-500">
        Admin có thể ghi nhận NCC khi kế toán vắng mặt
      </p>
      <div className="mt-6">
        <SupplierReceiptForm onSuccess={load} />
      </div>
      <div className="mt-10">
        <h2 className="text-lg font-semibold">Phiếu gần đây</h2>
        <SupplierReceiptList receipts={receipts} />
      </div>
    </AdminLayout>
  );
}
