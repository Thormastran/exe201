'use client';

import { AccountingLayout } from '@/views/accounting/AccountingLayout';
import { TransferStockForm } from '@/views/shared/TransferStockForm';

export default function AccountingTransferPage() {
  return (
    <AccountingLayout>
      <h1 className="text-2xl font-bold">Chuyển kho nội bộ</h1>
      <p className="mt-1 text-sm text-stone-500">
        Chuyển từ kho tổng (KHO2/KHO3) sang KHO1 quầy bếp
      </p>
      <div className="mt-6">
        <TransferStockForm />
      </div>
    </AccountingLayout>
  );
}
