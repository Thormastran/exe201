export enum StockMovementType {
  SUPPLIER_IN = 'SUPPLIER_IN',
  ORDER_OUT = 'ORDER_OUT',
  TRANSFER_OUT = 'TRANSFER_OUT',
  TRANSFER_IN = 'TRANSFER_IN',
  ADJUSTMENT = 'ADJUSTMENT',
}

export const STOCK_MOVEMENT_LABELS: Record<StockMovementType, string> = {
  [StockMovementType.SUPPLIER_IN]: 'Nhập kho (NCC)',
  [StockMovementType.ORDER_OUT]: 'Xuất theo đơn bếp',
  [StockMovementType.TRANSFER_OUT]: 'Chuyển kho đi',
  [StockMovementType.TRANSFER_IN]: 'Chuyển kho đến',
  [StockMovementType.ADJUSTMENT]: 'Điều chỉnh',
};
