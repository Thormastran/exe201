'use client';

import { useCallback, useEffect, useState } from 'react';
import { InventoryController } from '@/controllers/inventory.controller';
import {
  RETURN_CLOSURE_LABELS,
  RETURN_CLOSURE_STYLES,
  ReturnClosureStatus,
} from '@/models/return-closure.model';
import {
  STOCK_REQUEST_STATUS_LABELS,
  STOCK_REQUEST_TYPE_LABELS,
  StockRequestStatus,
  StockRequestType,
  StockTransferRequest,
} from '@/models/stock-request.model';
import { EmptyState } from '@/views/inventory/inventory-ui';

const STATUS_STYLES: Record<StockRequestStatus, string> = {
  [StockRequestStatus.PENDING]: 'bg-amber-100 text-amber-900',
  [StockRequestStatus.APPROVED]: 'bg-sky-100 text-sky-900',
  [StockRequestStatus.COMPLETED]: 'bg-emerald-100 text-emerald-900',
  [StockRequestStatus.REJECTED]: 'bg-red-100 text-red-900',
  [StockRequestStatus.DRAFT]: 'bg-stone-100 text-stone-700',
};

export function StockRequestsRegistry({
  defaultType,
  showReturnClosure = true,
}: {
  defaultType?: StockRequestType;
  showReturnClosure?: boolean;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [requests, setRequests] = useState<StockTransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StockRequestStatus | 'ALL'>('ALL');
  const [type, setType] = useState<StockRequestType | 'ALL'>(defaultType ?? 'ALL');
  const [businessDate, setBusinessDate] = useState(today);
  const [closure, setClosure] = useState<ReturnClosureStatus | 'ALL'>('ALL');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await InventoryController.getStockRequests({
        status: status === 'ALL' ? undefined : status,
        type: type === 'ALL' ? undefined : type,
        businessDate: businessDate || undefined,
        returnClosureStatus:
          closure === 'ALL' ? undefined : closure,
      });
      setRequests(data);
    } finally {
      setLoading(false);
    }
  }, [status, type, businessDate, closure]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 rounded-2xl border border-stone-200 bg-white p-4">
        <label className="text-sm">
          <span className="font-medium text-stone-600">Ngày NV</span>
          <input
            type="date"
            value={businessDate}
            onChange={(e) => setBusinessDate(e.target.value)}
            className="mt-1 block rounded-lg border px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-stone-600">Loại</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as StockRequestType | 'ALL')}
            className="mt-1 block rounded-lg border px-3 py-2"
          >
            <option value="ALL">Tất cả</option>
            <option value={StockRequestType.DISPATCH_FROM_CENTRAL}>Cấp phát</option>
            <option value={StockRequestType.RETURN_TO_CENTRAL}>Hoàn trả</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="font-medium text-stone-600">Trạng thái duyệt</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StockRequestStatus | 'ALL')}
            className="mt-1 block rounded-lg border px-3 py-2"
          >
            <option value="ALL">Tất cả</option>
            {Object.values(StockRequestStatus).map((s) => (
              <option key={s} value={s}>
                {STOCK_REQUEST_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        {showReturnClosure && (
          <label className="text-sm">
            <span className="font-medium text-stone-600">Hoàn trả (phiếu cấp)</span>
            <select
              value={closure}
              onChange={(e) =>
                setClosure(e.target.value as ReturnClosureStatus | 'ALL')
              }
              className="mt-1 block rounded-lg border px-3 py-2"
            >
              <option value="ALL">Tất cả</option>
              {[
                ReturnClosureStatus.OPEN,
                ReturnClosureStatus.PARTIAL,
                ReturnClosureStatus.CLOSED,
              ].map((c) => (
                <option key={c} value={c}>
                  {RETURN_CLOSURE_LABELS[c]}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {loading ? (
        <p className="mt-6 text-stone-500">Đang tải...</p>
      ) : !requests.length ? (
        <div className="mt-6">
          <EmptyState icon="📋" title="Không có phiếu trong bộ lọc" />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3">Mã phiếu</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Kho</th>
                <th className="px-4 py-3">Chứng từ</th>
                <th className="px-4 py-3">Gắn phiếu cấp</th>
                <th className="px-4 py-3">Duyệt</th>
                <th className="px-4 py-3">Hoàn trả</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-stone-100 hover:bg-blue-50/30">
                  <td className="px-4 py-3 font-mono font-bold">{r.requestNumber}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium">
                      {STOCK_REQUEST_TYPE_LABELS[r.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {r.fromWarehouseCode} → {r.toWarehouseCode}
                  </td>
                  <td className="px-4 py-3 text-xs">{r.permitDocumentNumber}</td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-700">
                    {r.parentRequestNumber ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[r.status]}`}
                    >
                      {STOCK_REQUEST_STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.type === StockRequestType.DISPATCH_FROM_CENTRAL &&
                    r.returnClosureStatus ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${RETURN_CLOSURE_STYLES[r.returnClosureStatus as ReturnClosureStatus] ?? ''}`}
                      >
                        {RETURN_CLOSURE_LABELS[r.returnClosureStatus as ReturnClosureStatus] ??
                          r.returnClosureStatus}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
