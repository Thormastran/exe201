'use client';

import { WarehouseLayout } from '@/views/warehouse/WarehouseLayout';
import { TransferStockForm } from '@/views/shared/TransferStockForm';

export default function WarehouseTransferPage() {
  return (
    <WarehouseLayout>
      <h1 className="text-2xl font-bold">Chuyển kho nội bộ</h1>
      <p className="mt-1 text-sm text-stone-500">Chuyển nguyên liệu giữa KHO1 / KHO2 / KHO3</p>
      <div className="mt-6">
        <TransferStockForm />
      </div>
    </WarehouseLayout>
  );
}
