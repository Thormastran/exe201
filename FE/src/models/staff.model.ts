export enum WorkShift {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}

export enum WorkRole {
  CASHIER = 'CASHIER',
  SERVER = 'SERVER',
}

export const WORK_SHIFT_LABELS: Record<WorkShift, string> = {
  [WorkShift.MORNING]: 'Ca sáng',
  [WorkShift.AFTERNOON]: 'Ca trưa',
  [WorkShift.EVENING]: 'Ca chiều',
  [WorkShift.NIGHT]: 'Ca tối',
};

export const WORK_SHIFT_HOURS: Record<WorkShift, string> = {
  [WorkShift.MORNING]: '7h - 12h',
  [WorkShift.AFTERNOON]: '12h - 17h',
  [WorkShift.EVENING]: '17h - 21h',
  [WorkShift.NIGHT]: '21h - 23h',
};

export const WORK_ROLE_LABELS: Record<WorkRole, string> = {
  [WorkRole.CASHIER]: 'Thu ngân',
  [WorkRole.SERVER]: 'Phục vụ',
};

export interface StaffSession {
  workShift: WorkShift;
  workRole: WorkRole;
  startedAt: string;
}

export const STAFF_ROUTES: Record<WorkRole, string> = {
  [WorkRole.CASHIER]: '/dashboard/staff/cashier',
  [WorkRole.SERVER]: '/dashboard/staff/server',
};
