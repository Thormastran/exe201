'use client';

import { StockRequestsPanel } from '@/views/shared/StockRequestsPanel';
import { InventoryPageHeader } from '@/views/inventory/inventory-ui';
import { AccountingLayout } from './AccountingLayout';

export function AccountingRequestsView() {
  return (
    <AccountingLayout>
      <div className="space-y-6">
        <InventoryPageHeader
          theme="accounting"
          badge="Duyệt phiếu"
          title="Phiếu xin nhập / xuất kho"
          subtitle="Kiểm tra chứng từ xin phép, duyệt hoặc từ chối — tồn chỉ thay đổi sau khi duyệt."
        />
        <StockRequestsPanel theme="accounting" />
      </div>
    </AccountingLayout>
  );
}
