'use client';

import { WarehouseStockPanel } from '@/views/shared/WarehouseStockPanel';
import { WarehouseLayout } from './WarehouseLayout';

export function StockDashboardView({ embedded }: { embedded?: boolean }) {
  const panel = <WarehouseStockPanel theme="warehouse" />;
  if (embedded) return panel;
  return <WarehouseLayout>{panel}</WarehouseLayout>;
}
