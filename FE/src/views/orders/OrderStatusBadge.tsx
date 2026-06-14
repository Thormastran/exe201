import {
  normalizeStatus,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from '@/models/order.model';

export function OrderStatusBadge({ status }: { status: string }) {
  const normalized = normalizeStatus(status);
  const color =
    ORDER_STATUS_COLORS[normalized] ??
    'bg-stone-100 text-stone-600 border-stone-200';

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}
    >
      {ORDER_STATUS_LABELS[normalized] ?? status}
    </span>
  );
}
