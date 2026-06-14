'use client';



import { ManagerLayout } from '@/views/manager/ManagerLayout';

import { StockRequestForm } from '@/views/shared/StockRequestForm';

import { InventoryPageHeader } from '@/views/inventory/inventory-ui';

import { StockRequestType } from '@/models/stock-request.model';



export default function ManagerReplenishPage() {

  return (

    <ManagerLayout>

      <div className="space-y-6">

        <InventoryPageHeader

          theme="warehouse"

          badge="Bổ sung"

          title="Bổ sung tồn (khi cần)"

          subtitle="Luồng kho — không bắt hoàn trả cuối ca. Ưu tiên để nhân viên kho lập; quản lý có thể hỗ trợ."

        />

        <StockRequestForm type={StockRequestType.REPLENISH_FROM_CENTRAL} />

      </div>

    </ManagerLayout>

  );

}


