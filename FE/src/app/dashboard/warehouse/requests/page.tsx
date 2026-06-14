'use client';



import { WarehouseLayout } from '@/views/warehouse/WarehouseLayout';

import { StockRequestsRegistry } from '@/views/shared/StockRequestsRegistry';

import { InventoryPageHeader } from '@/views/inventory/inventory-ui';



export default function WarehouseRequestsPage() {

  return (

    <WarehouseLayout>

      <div className="space-y-6">

        <InventoryPageHeader

          theme="warehouse"

          badge="Phiếu kho"

          title="Danh sách phiếu"

          subtitle="Phiếu bổ sung tồn và các phiếu bạn đã lập — chờ kế toán duyệt."

        />

        <StockRequestsRegistry showReturnClosure={false} />

      </div>

    </WarehouseLayout>

  );

}


