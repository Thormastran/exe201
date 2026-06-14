'use client';

import { FormEvent, useEffect, useState } from 'react';
import { InventoryController } from '@/controllers/inventory.controller';
import { Ingredient, SupplierReceipt } from '@/models/inventory.model';

interface LineRow {
  ingredientId: string;
  quantity: number;
  unitPrice: number;
}

const emptyLine = (): LineRow => ({
  ingredientId: '',
  quantity: 0,
  unitPrice: 0,
});

interface SupplierReceiptFormProps {
  onSuccess?: () => void;
}

export function SupplierReceiptForm({ onSuccess }: SupplierReceiptFormProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    supplierName: '',
    documentNumber: '',
    documentDate: new Date().toISOString().slice(0, 10),
    note: '',
    lines: [emptyLine(), emptyLine()],
  });

  useEffect(() => {
    InventoryController.getIngredients().then(setIngredients);
  }, []);

  const updateLine = (index: number, patch: Partial<LineRow>) => {
    setForm((f) => ({
      ...f,
      lines: f.lines.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const lines = form.lines.filter((l) => l.ingredientId && l.quantity > 0);
    if (!form.supplierName.trim() || !form.documentNumber.trim()) {
      setError('Nhập tên NCC và số chứng từ / hóa đơn');
      return;
    }
    if (!lines.length) {
      setError('Thêm ít nhất một dòng nguyên liệu');
      return;
    }

    setSaving(true);
    try {
      await InventoryController.createSupplierReceipt({
        supplierName: form.supplierName.trim(),
        documentNumber: form.documentNumber.trim(),
        documentDate: form.documentDate,
        note: form.note.trim() || undefined,
        lines: lines.map((l) => ({
          ingredientId: l.ingredientId,
          quantity: l.quantity,
          unitPrice: l.unitPrice > 0 ? l.unitPrice : undefined,
        })),
      });
      setSuccess('Đã ghi nhận vào KHO_TONG — dùng cho sao kê cuối tháng');
      setForm({
        supplierName: '',
        documentNumber: '',
        documentDate: new Date().toISOString().slice(0, 10),
        note: '',
        lines: [emptyLine(), emptyLine()],
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/50"
    >
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 text-sm text-blue-900">
        <strong>Kho tổng (KHO_TONG)</strong> — Chỉ kế toán nhập NCC. Hàng vào kho tổng;
        quản lý kho lập phiếu xin nhập có chứng từ để chuyển sang kho 1/2/3.
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{success}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Nhà cung cấp</span>
          <input
            required
            value={form.supplierName}
            onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Số hóa đơn / chứng từ NCC</span>
          <input
            required
            value={form.documentNumber}
            onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="HD-2026-xxxxx"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Ngày chứng từ</span>
          <input
            type="date"
            required
            value={form.documentDate}
            onChange={(e) => setForm({ ...form, documentDate: e.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium">Ghi chú kế toán</span>
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
      </div>

      <div>
        <p className="mb-2 font-medium">Chi tiết nhập kho tổng</p>
        <div className="space-y-2">
          {form.lines.map((line, idx) => (
            <div key={idx} className="flex flex-wrap gap-2">
              <select
                value={line.ingredientId}
                onChange={(e) => updateLine(idx, { ingredientId: e.target.value })}
                className="min-w-[180px] flex-1 rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">— Nguyên liệu —</option>
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.name} ({ing.unit})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="SL"
                value={line.quantity || ''}
                onChange={(e) =>
                  updateLine(idx, { quantity: parseFloat(e.target.value) || 0 })
                }
                className="w-28 rounded-lg border px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={0}
                step="any"
                placeholder="Đơn giá"
                value={line.unitPrice || ''}
                onChange={(e) =>
                  updateLine(idx, { unitPrice: parseFloat(e.target.value) || 0 })
                }
                className="w-32 rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, lines: [...f.lines, emptyLine()] }))}
          className="mt-2 text-sm text-blue-700 hover:underline"
        >
          + Thêm dòng
        </button>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? 'Đang lưu...' : 'Ghi nhận NCC vào kho tổng'}
      </button>
    </form>
  );
}

export function SupplierReceiptList({ receipts }: { receipts: SupplierReceipt[] }) {
  if (!receipts.length) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 px-6 py-10 text-center">
        <span className="text-3xl">📭</span>
        <p className="mt-2 text-sm text-stone-500">Chưa có phiếu nhập NCC</p>
      </div>
    );
  }
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      {receipts.slice(0, 20).map((r) => (
        <article
          key={r.id}
          className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-2xl">🏭</span>
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {r.warehouseCode ?? 'KHO_TONG'}
            </span>
          </div>
          <p className="mt-2 font-semibold text-stone-900">{r.supplierName}</p>
          <p className="font-mono text-sm text-blue-800">CT {r.documentNumber}</p>
          <p className="mt-2 text-xs text-stone-500">
            {new Date(r.documentDate).toLocaleDateString('vi-VN')} · {r.createdByName ?? '—'}
          </p>
        </article>
      ))}
    </div>
  );
}
