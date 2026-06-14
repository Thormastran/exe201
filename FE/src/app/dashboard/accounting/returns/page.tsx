'use client';

import { AccountingLayout } from '@/views/accounting/AccountingLayout';
import { StockRequestsRegistry } from '@/views/shared/StockRequestsRegistry';
import { InventoryPageHeader } from '@/views/inventory/inventory-ui';
import { StockRequestType } from '@/models/stock-request.model';

export default function AccountingReturnsPage() {
  return (
    <AccountingLayout>
      <div className="space-y-6">
        <InventoryPageHeader
          theme="accounting"
          badge="Đối chiếu"
          title="Danh sách cấp phát & hoàn trả"
          subtitle="Kiểm tra phiếu hoàn trả có gắn đúng phiếu cấp phát và trạng thái đóng ngày."
        />
        <StockRequestsRegistry defaultType={StockRequestType.RETURN_TO_CENTRAL} />
      </div>
    </AccountingLayout>
  );
}
