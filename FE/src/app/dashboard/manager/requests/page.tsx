'use client';



import { ManagerLayout } from '@/views/manager/ManagerLayout';

import { StockRequestsRegistry } from '@/views/shared/StockRequestsRegistry';

import { InventoryPageHeader } from '@/views/inventory/inventory-ui';



export default function ManagerRequestsPage() {

  return (

    <ManagerLayout>

      <div className="space-y-6">

        <InventoryPageHeader

          theme="warehouse"

          badge="Phiếu ca"

          title="Danh sách phiếu quản lý"

          subtitle="Cấp phát, hoàn trả trong ngày — lọc theo ngày nghiệp vụ."

        />

        <StockRequestsRegistry />

      </div>

    </ManagerLayout>

  );

}


