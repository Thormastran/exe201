export enum WorkRole {
  CASHIER = 'CASHIER',
  SERVER = 'SERVER',
}

export const WORK_ROLE_LABELS: Record<WorkRole, string> = {
  [WorkRole.CASHIER]: 'Thu ngân',
  [WorkRole.SERVER]: 'Phục vụ',
};
