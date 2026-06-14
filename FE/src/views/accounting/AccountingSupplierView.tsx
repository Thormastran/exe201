'use client';

import { useCallback, useEffect, useState } from 'react';
import { InventoryController } from '@/controllers/inventory.controller';
import { SupplierReceipt } from '@/models/inventory.model';
import { SupplierReceiptForm, SupplierReceiptList } from '@/views/shared/SupplierReceiptForm';
import { InventoryPageHeader } from '@/views/inventory/inventory-ui';
import { AccountingLayout } from './AccountingLayout';

export function AccountingSupplierView() {
  const [receipts, setReceipts] = useState<SupplierReceipt[]>([]);

  const load = useCallback(async () => {
    const data = await InventoryController.getSupplierReceipts();
    setReceipts(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AccountingLayout>
      <div className="space-y-8">
        <InventoryPageHeader
          theme="accounting"
          badge="Nhập NCC"
          title="Nhập nhà cung cấp → Kho tổng"
          subtitle="Chỉ ghi nhận vào KHO_TONG. Quản lý kho lập phiếu xin chuyển sang KHO1/2/3 sau khi kế toán duyệt."
        />

        <SupplierReceiptForm onSuccess={load} />

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-stone-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
              📥
            </span>
            Phiếu nhập gần đây
          </h2>
          <SupplierReceiptList receipts={receipts} />
        </section>
      </div>
    </AccountingLayout>
  );
}
