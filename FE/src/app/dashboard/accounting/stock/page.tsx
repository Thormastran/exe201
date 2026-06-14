'use client';

import { WarehouseStockPanel } from '@/views/shared/WarehouseStockPanel';
import { AccountingLayout } from '@/views/accounting/AccountingLayout';

export default function AccountingStockPage() {
  return (
    <AccountingLayout>
      <WarehouseStockPanel theme="accounting" title="Tồn kho đa chi nhánh" />
    </AccountingLayout>
  );
}
