'use client';

import { LedgerPanel } from '@/views/shared/LedgerPanel';
import { InventoryPageHeader } from '@/views/inventory/inventory-ui';
import { AccountingLayout } from './AccountingLayout';

export function AccountingLedgerView() {
  return (
    <AccountingLayout>
      <div className="space-y-6">
        <InventoryPageHeader
          theme="accounting"
          badge="Sao kê"
          title="Sao kê chứng từ theo tháng"
          subtitle="Đối chiếu phiếu NCC (kho tổng) và phiếu chuyển kho đã hoàn tất."
        />
        <LedgerPanel />
      </div>
    </AccountingLayout>
  );
}
