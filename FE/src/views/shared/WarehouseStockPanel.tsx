'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePolling } from '@/lib/use-polling';
import { InventoryController } from '@/controllers/inventory.controller';
import { StockItem, WarehouseLocation } from '@/models/inventory.model';
import {
  EmptyState,
  InventoryPageHeader,
  LoadingGrid,
  StockCardGrid,
  WarehouseSelector,
  type InventoryTheme,
} from '@/views/inventory/inventory-ui';

const POLL_MS = 12_000;

export function WarehouseStockPanel({
  title,
  theme = 'warehouse',
}: {
  title?: string;
  theme?: InventoryTheme;
}) {
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>([]);
  const [warehouseId, setWarehouseId] = useState('');
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    InventoryController.getWarehouses().then((whs) => {
      setWarehouses(whs);
      const central = whs.find((w) => w.isCentralWarehouse) ?? whs[0];
      if (central) setWarehouseId(central.id);
    });
  }, []);

  const load = useCallback(async () => {
    if (!warehouseId) return;
    try {
      const data = await InventoryController.getStock(warehouseId);
      setItems(data);
      setLastSync(new Date());
      setError('');
    } catch {
      setError('Không tải được tồn kho');
    } finally {
      setLoading(false);
    }
  }, [warehouseId]);

  usePolling(load, POLL_MS, !!warehouseId);

  const selected = warehouses.find((w) => w.id === warehouseId);
  const lowCount = useMemo(() => items.filter((i) => i.isLow).length, [items]);

  return (
    <div className="space-y-6">
      <InventoryPageHeader
        theme={theme}
        badge="Tồn kho"
        title={title ?? 'Theo dõi tồn realtime'}
        subtitle={
          selected
            ? `${selected.name}${selected.isKitchenSource ? ' · Bếp trừ kho khi đơn READY' : selected.isCentralWarehouse ? ' · Nguồn nhập NCC' : ' · Nhận hàng qua phiếu đã duyệt'}`
            : undefined
        }
      >
        {lastSync && (
          <p className="rounded-lg bg-white/15 px-3 py-1.5 text-xs text-white/90">
            Cập nhật {lastSync.toLocaleTimeString('vi-VN')}
          </p>
        )}
      </InventoryPageHeader>

      {warehouses.length > 0 && (
        <WarehouseSelector
          theme={theme}
          warehouses={warehouses}
          selectedId={warehouseId}
          onSelect={(id) => {
            setLoading(true);
            setWarehouseId(id);
          }}
        />
      )}

      {lowCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>{lowCount}</strong> mặt hàng dưới mức tối thiểu tại <strong>{selected?.code}</strong>
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {loading && items.length === 0 ? (
        <LoadingGrid />
      ) : items.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Kho trống"
          description="Nhập NCC vào KHO_TONG hoặc duyệt phiếu chuyển kho"
        />
      ) : (
        <StockCardGrid items={items} />
      )}
    </div>
  );
}
