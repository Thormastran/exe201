export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  KITCHEN = 'KITCHEN',
  WAREHOUSE = 'WAREHOUSE',
  ACCOUNTING = 'ACCOUNTING',
  STORE_MANAGER = 'STORE_MANAGER',
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Quản trị viên',
  [Role.STAFF]: 'Nhân viên bán hàng',
  [Role.KITCHEN]: 'Bếp',
  [Role.WAREHOUSE]: 'Nhân viên kho',
  [Role.ACCOUNTING]: 'Kế toán',
  [Role.STORE_MANAGER]: 'Quản lý cửa hàng',
};
