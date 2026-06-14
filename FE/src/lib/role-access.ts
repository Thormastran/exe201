import { Role } from '@/models/user.model';

/** Chủ cửa hàng — được dùng mọi chức năng vận hành */
export function isStoreOwner(role?: Role | string): boolean {
  return role === Role.ADMIN;
}

/** Kiểm tra quyền: ADMIN luôn được phép */
export function canAccessRole(userRole: Role | string | undefined, ...allowed: Role[]): boolean {
  if (!userRole) return false;
  if (isStoreOwner(userRole)) return true;
  return allowed.includes(userRole as Role);
}
