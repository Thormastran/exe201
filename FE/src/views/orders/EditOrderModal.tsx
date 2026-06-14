'use client';

import { FormEvent, useEffect, useState } from 'react';
import { OrderController } from '@/controllers/order.controller';
import { formatToppingsLabel, cartSubtotal } from '@/lib/cart';
import { formatCurrency } from '@/lib/format';
import { Order, OrderLineItem } from '@/models/order.model';
import { Modal } from '@/views/components/Modal';

interface EditOrderModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function EditOrderModal({
  order,
  open,
  onClose,
  onSaved,
}: EditOrderModalProps) {
  const [items, setItems] = useState<OrderLineItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!order) return;
    setItems(order.items.map((i) => ({ ...i })));
    setCustomerName(order.customerName ?? '');
    setCustomerPhone(order.customerPhone ?? '');
    setTableNumber(order.tableNumber ?? '');
    setNote(order.note ?? '');
  }, [order]);

  const subtotal = cartSubtotal(
    items.map((i, idx) => ({
      cartLineId: String(idx),
      menuItemId: i.menuItemId,
      name: i.name,
      basePrice: i.basePrice,
      toppings: i.toppings,
      price: i.price,
      quantity: i.quantity,
    })),
  );

  const updateQty = (index: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!order || items.length === 0) {
      setError('Đơn phải có ít nhất 1 món');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await OrderController.update(order.id, {
        items,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        tableNumber: tableNumber || undefined,
        note: note || undefined,
        subtotal,
        total: subtotal,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg">
      <form onSubmit={handleSubmit} className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold">Sửa đơn #{order?.orderNumber}</h2>
        <p className="text-xs text-stone-500">Chỉ sửa được khi bếp chưa bắt đầu làm</p>

        <div className="mt-4 space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.name}</p>
                {item.toppings?.length > 0 && (
                  <p className="text-xs text-violet-600">
                    + {formatToppingsLabel(item.toppings)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQty(idx, -1)}
                  className="h-7 w-7 rounded bg-stone-100"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQty(idx, 1)}
                  className="h-7 w-7 rounded bg-stone-100"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="Tên khách"
          />
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="SĐT"
          />
          <input
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="Số bàn"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
            rows={2}
            placeholder="Ghi chú"
          />
        </div>

        <p className="mt-3 text-right font-bold text-amber-600">
          Tổng: {formatCurrency(subtotal)}
        </p>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border py-2.5">
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-xl bg-amber-500 py-2.5 font-bold text-white disabled:opacity-60"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
