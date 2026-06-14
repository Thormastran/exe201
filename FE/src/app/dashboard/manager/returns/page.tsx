'use client';



import { ManagerLayout } from '@/views/manager/ManagerLayout';

import { StockRequestForm } from '@/views/shared/StockRequestForm';

import { StockRequestsRegistry } from '@/views/shared/StockRequestsRegistry';

import { InventoryPageHeader } from '@/views/inventory/inventory-ui';

import { StockRequestType } from '@/models/stock-request.model';



export default function ManagerReturnsPage() {

  return (

    <ManagerLayout>

      <div className="space-y-8">

        <InventoryPageHeader

          theme="warehouse"

          badge="Cuối ca"

          title="Hoàn trả & danh sách phiếu"

          subtitle="Gắn đúng mã PXK cấp phát. Theo dõi trạng thái hoàn trả."

        />

        <StockRequestForm type={StockRequestType.RETURN_TO_CENTRAL} />

        <section>

          <h2 className="mb-4 text-lg font-bold text-stone-900">Danh sách phiếu</h2>

          <StockRequestsRegistry />

        </section>

      </div>

    </ManagerLayout>

  );

}


