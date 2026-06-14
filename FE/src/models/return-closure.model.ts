export enum ReturnClosureStatus {
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  OPEN = 'OPEN',
  PARTIAL = 'PARTIAL',
  CLOSED = 'CLOSED',
}

export const RETURN_CLOSURE_LABELS: Record<ReturnClosureStatus, string> = {
  [ReturnClosureStatus.NOT_APPLICABLE]: '—',
  [ReturnClosureStatus.OPEN]: 'Chờ hoàn trả',
  [ReturnClosureStatus.PARTIAL]: 'Hoàn trả một phần',
  [ReturnClosureStatus.CLOSED]: 'Đã hoàn trả đủ',
};

export const RETURN_CLOSURE_STYLES: Record<ReturnClosureStatus, string> = {
  [ReturnClosureStatus.NOT_APPLICABLE]: 'bg-stone-100 text-stone-600',
  [ReturnClosureStatus.OPEN]: 'bg-amber-100 text-amber-900',
  [ReturnClosureStatus.PARTIAL]: 'bg-sky-100 text-sky-900',
  [ReturnClosureStatus.CLOSED]: 'bg-emerald-100 text-emerald-900',
};
