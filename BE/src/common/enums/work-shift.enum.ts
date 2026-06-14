export enum WorkShift {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}

export const WORK_SHIFT_LABELS: Record<WorkShift, string> = {
  [WorkShift.MORNING]: 'Ca sáng (7h - 12h)',
  [WorkShift.AFTERNOON]: 'Ca trưa (12h - 17h)',
  [WorkShift.EVENING]: 'Ca chiều (17h - 21h)',
  [WorkShift.NIGHT]: 'Ca tối (21h - 23h)',
};
