export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  /** @deprecated legacy */
  CONFIRMED = 'CONFIRMED',
  /** @deprecated legacy */
  SERVING = 'SERVING',
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  [OrderStatus.PENDING]: 'Chưa thực hiện',
  [OrderStatus.PREPARING]: 'Đang thực hiện',
  [OrderStatus.READY]: 'Đã hoàn thành',
  [OrderStatus.COMPLETED]: 'Hoàn tất',
  [OrderStatus.CANCELLED]: 'Đã hủy',
  [OrderStatus.CONFIRMED]: 'Chưa thực hiện',
  [OrderStatus.SERVING]: 'Đang thực hiện',
};

export const KITCHEN_STATUS_FLOW: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PREPARING,
  OrderStatus.READY,
];

export function normalizeOrderStatus(status: string): OrderStatus {
  if (status === OrderStatus.CONFIRMED) return OrderStatus.PENDING;
  if (status === OrderStatus.SERVING) return OrderStatus.PREPARING;
  return status as OrderStatus;
}

export function isPendingStatus(status: string): boolean {
  const s = normalizeOrderStatus(status);
  return s === OrderStatus.PENDING;
}
