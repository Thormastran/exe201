/** Trạng thái hoàn trả của phiếu cấp phát trong ngày */
export enum ReturnClosureStatus {
  /** Phiếu hoàn trả hoặc không áp dụng */
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  /** Đã cấp — chưa hoàn trả */
  OPEN = 'OPEN',
  /** Đã hoàn trả một phần */
  PARTIAL = 'PARTIAL',
  /** Đã hoàn trả đủ (đóng phiếu ngày) */
  CLOSED = 'CLOSED',
}

export const RETURN_CLOSURE_LABELS: Record<ReturnClosureStatus, string> = {
  [ReturnClosureStatus.NOT_APPLICABLE]: '—',
  [ReturnClosureStatus.OPEN]: 'Chờ hoàn trả cuối ngày',
  [ReturnClosureStatus.PARTIAL]: 'Hoàn trả một phần',
  [ReturnClosureStatus.CLOSED]: 'Đã hoàn trả đủ',
};
