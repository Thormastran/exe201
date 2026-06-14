'use client';



import { WarehouseLayout } from '@/views/warehouse/WarehouseLayout';

import { StockRequestForm } from '@/views/shared/StockRequestForm';

import { InventoryPageHeader } from '@/views/inventory/inventory-ui';

import { StockRequestType } from '@/models/stock-request.model';



export default function WarehouseReplenishPage() {

  return (

    <WarehouseLayout>

      <div className="space-y-6">

        <InventoryPageHeader

          theme="warehouse"

          badge="Luồng kho"

          title="Bổ sung tồn kho lẻ"

          subtitle="Chuyển từ kho tổng sang kho bán hàng / bếp — không yêu cầu hoàn trả cuối ca. Cấp phát theo ca do quản lý cửa hàng lập."

        />

        <StockRequestForm type={StockRequestType.REPLENISH_FROM_CENTRAL} />

      </div>

    </WarehouseLayout>

  );

}


