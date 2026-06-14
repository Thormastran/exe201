'use client';

import { formatCurrency } from '@/lib/format';
import { Modal } from '@/views/components/Modal';

export interface PaymentOption {
  code: string;
  label: string;
  description?: string;
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  subtotal: number;
  customerName: string;
  customerPhone: string;
  tableNumber: string;
  note: string;
  paymentMethod: string;
  paymentOptions: PaymentOption[];
  onCustomerNameChange: (v: string) => void;
  onCustomerPhoneChange: (v: string) => void;
  onTableNumberChange: (v: string) => void;
  onNoteChange: (v: string) => void;
  onPaymentMethodChange: (code: string) => void;
  onSubmit: () => void;
}

export function CheckoutModal({
  open,
  onClose,
  subtotal,
  customerName,
  customerPhone,
  tableNumber,
  note,
  paymentMethod,
  paymentOptions,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onTableNumberChange,
  onNoteChange,
  onPaymentMethodChange,
  onSubmit,
}: CheckoutModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-3xl">
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200/80">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Thanh toán</h2>
            <p className="text-sm text-stone-500">Thông tin khách & phương thức</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="space-y-3 border-b border-stone-100 p-5 md:border-b-0 md:border-r">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Khách hàng
            </p>
            <input
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Tên khách (tuỳ chọn)"
            />
            <input
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Số điện thoại"
            />
            <input
              value={tableNumber}
              onChange={(e) => onTableNumberChange(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Số bàn (để trống = STT đơn tự động)"
            />
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Ghi chú đơn"
            />
          </div>

          <div className="flex flex-col bg-gradient-to-b from-stone-50 to-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Phương thức
            </p>
            <div className="mt-3 space-y-2">
              {paymentOptions.map((method) => (
                <button
                  key={method.code}
                  type="button"
                  onClick={() => onPaymentMethodChange(method.code)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition ${
                    paymentMethod === method.code
                      ? 'border-amber-500 bg-white shadow-sm'
                      : 'border-transparent bg-white/80 hover:border-stone-200'
                  }`}
                >
                  <span className="text-2xl">
                    {method.code === 'CASH' ? '💵' : '🏦'}
                  </span>
                  <div>
                    <p className="font-semibold text-stone-800">{method.label}</p>
                    {method.description && (
                      <p className="text-xs text-stone-500">{method.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-auto pt-5">
              <div className="rounded-xl bg-stone-900 px-4 py-3 text-white">
                <p className="text-xs text-stone-400">Tổng thanh toán</p>
                <p className="text-2xl font-bold text-amber-400">
                  {formatCurrency(subtotal)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-stone-100 bg-stone-50/80 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-600"
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!paymentMethod}
            className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-bold text-white shadow-lg disabled:opacity-40"
          >
            Xem hóa đơn & xác nhận →
          </button>
        </div>
      </div>
    </Modal>
  );
}
