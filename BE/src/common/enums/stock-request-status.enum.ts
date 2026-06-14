export enum StockRequestStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export const STOCK_REQUEST_STATUS_LABELS: Record<StockRequestStatus, string> = {
  [StockRequestStatus.DRAFT]: 'Nháp',
  [StockRequestStatus.PENDING]: 'Chờ kế toán duyệt',
  [StockRequestStatus.APPROVED]: 'Đã duyệt',
  [StockRequestStatus.REJECTED]: 'Từ chối',
  [StockRequestStatus.COMPLETED]: 'Đã hoàn tất',
};
