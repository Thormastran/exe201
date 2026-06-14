'use client';



import { ManagerLayout } from '@/views/manager/ManagerLayout';

import { StockRequestForm } from '@/views/shared/StockRequestForm';

import { InventoryPageHeader } from '@/views/inventory/inventory-ui';

import { StockRequestType } from '@/models/stock-request.model';



export default function ManagerIssuePage() {

  return (

    <ManagerLayout>

      <div className="space-y-6">

        <InventoryPageHeader

          theme="warehouse"

          badge="Đầu ca"

          title="Xin cấp phát trong ngày"

          subtitle="Kho tổng → kho con. Cuối ca bắt buộc hoàn trả gắn mã phiếu này."

        />

        <StockRequestForm type={StockRequestType.DISPATCH_FROM_CENTRAL} />

      </div>

    </ManagerLayout>

  );

}


