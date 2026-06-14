'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePolling } from '@/lib/use-polling';
import { useRouter } from 'next/navigation';
import { OrderController } from '@/controllers/order.controller';
import { getStoredUser } from '@/lib/auth-storage';
import { canAccessRole } from '@/lib/role-access';
import { KitchenLayout } from './KitchenLayout';
import {
  normalizeStatus,
  Order,
  OrderStatus,
} from '@/models/order.model';
import { Role, User } from '@/models/user.model';
import { OrderGridCard } from '@/views/orders/OrderGridCard';
import { OrderBillDetail } from '@/views/orders/OrderBillDetail';
import { OrderStatusBadge } from '@/views/orders/OrderStatusBadge';

type FilterKey = 'active' | OrderStatus.PENDING | OrderStatus.PREPARING | OrderStatus.READY;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'active', label: 'Đang xử lý' },
  { key: OrderStatus.PENDING, label: 'Chưa thực hiện' },
  { key: OrderStatus.PREPARING, label: 'Đang thực hiện' },
  { key: OrderStatus.READY, label: 'Đã hoàn thành' },
];

export function KitchenOrdersView() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('active');
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await OrderController.getToday(undefined, true);
      setOrders(data.filter((o) => normalizeStatus(o.status) !== OrderStatus.CANCELLED));
      setError('');
    } catch {
      if (!silent) setError('Không tải được danh sách đơn');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredUser<User>();
    if (!stored || !canAccessRole(stored.role, Role.KITCHEN)) {
      router.replace('/login');
      return;
    }
    setUser((prev) => {
      if (prev && prev.email === stored.email) return prev;
      return stored;
    });
    void load(false);
  }, [router, load]);

  usePolling(() => load(true), 12_000, !!user);

  const filtered = useMemo(() => {
    if (filter === 'active') {
      return orders.filter((o) => {
        const s = normalizeStatus(o.status);
        return s !== OrderStatus.READY && s !== OrderStatus.COMPLETED;
      });
    }
    return orders.filter((o) => normalizeStatus(o.status) === filter);
  }, [orders, filter]);

  const selectedStatus = selected ? normalizeStatus(selected.status) : null;

  const nextStatus =
    selectedStatus === OrderStatus.PENDING
      ? OrderStatus.PREPARING
      : selectedStatus === OrderStatus.PREPARING
        ? OrderStatus.READY
        : null;

  const nextLabel =
    nextStatus === OrderStatus.PREPARING
      ? 'Bắt đầu làm → Đang thực hiện'
      : nextStatus === OrderStatus.READY
        ? 'Hoàn thành → Đã xong'
        : null;

  const handleAdvance = async () => {
    if (!selected || !nextStatus) return;
    setUpdating(true);
    setError('');
    try {
      const updated = await OrderController.updateKitchenStatus(
        selected.id,
        nextStatus,
      );
      setSelected(updated);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật thất bại');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-500">
        Đang tải...
      </div>
    );
  }

  return (
    <KitchenLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Danh sách đơn bếp</h1>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm hover:bg-stone-50"
        >
          🔄 Làm mới
        </button>
      </div>
      <div>
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                filter === f.key
                  ? 'bg-sky-500 text-white'
                  : 'bg-white text-stone-600 ring-1 ring-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <div>
            {loading ? (
              <p className="text-stone-400">Đang tải...</p>
            ) : filtered.length === 0 ? (
              <p className="rounded-2xl bg-white p-12 text-center text-stone-400">
                Không có đơn trong mục này
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((order) => (
                  <OrderGridCard
                    key={order.id}
                    order={order}
                    selected={selected?.id === order.id}
                    onClick={() => setSelected(order)}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-4 lg:h-fit">
            {selected ? (
              <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold">Thông tin đơn</h2>
                  <OrderStatusBadge status={selected.status} />
                </div>

                <div className="mb-4 rounded-xl bg-sky-50 p-3 text-sm">
                  <p className="font-semibold text-sky-900">Khách hàng</p>
                  <p className="mt-1">
                    {selected.customerName || 'Khách lẻ'}
                    {selected.customerPhone && ` · ${selected.customerPhone}`}
                  </p>
                  <p className="mt-1 text-sky-700">
                    Bàn / Order: <strong>#{selected.tableNumber}</strong>
                  </p>
                </div>

                <OrderBillDetail order={selected} />

                {nextLabel ? (
                  <button
                    type="button"
                    onClick={handleAdvance}
                    disabled={updating}
                    className="mt-4 w-full rounded-xl bg-sky-500 py-3 text-sm font-bold text-white hover:bg-sky-600 disabled:opacity-60"
                  >
                    {updating ? 'Đang cập nhật...' : nextLabel}
                  </button>
                ) : (
                  <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700">
                    ✓ Đơn đã hoàn thành bếp
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-sky-200 bg-white/60 p-8 text-center text-sm text-stone-400">
                Chọn đơn để xem bill và cập nhật trạng thái
              </div>
            )}
          </aside>
        </div>
      </div>
    </KitchenLayout>
  );
}
