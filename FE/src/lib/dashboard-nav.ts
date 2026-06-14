import { SaasFeature } from '@/models/saas-feature.model';
import { planHasFeature } from '@/lib/plan-features';
import type { NavSection } from '@/views/components/AppShellLayout';

export type OwnerNavItem = {
  href: string;
  label: string;
  exact?: boolean;
  feature?: SaasFeature;
};

/** Menu chủ cửa hàng — mỗi mục gắn feature để lọc theo gói */
export const OWNER_NAV_SECTIONS: NavSection[] = [
  {
    label: 'Tổng quan',
    items: [{ href: '/dashboard/admin', label: 'Dashboard', exact: true }],
  },
  {
    label: 'Bán hàng',
    items: [
      {
        href: '/dashboard/staff/setup',
        label: 'Chọn ca / vai trò',
        feature: SaasFeature.SHIFT_MGMT,
      },
      { href: '/dashboard/staff/cashier', label: 'Thu ngân (POS)', feature: SaasFeature.POS },
      {
        href: '/dashboard/staff/cashier/orders',
        label: 'Đơn thu ngân',
        feature: SaasFeature.POS,
      },
      { href: '/dashboard/staff/server', label: 'Phục vụ', feature: SaasFeature.POS },
    ],
  },
  {
    label: 'Bếp',
    items: [
      { href: '/dashboard/kitchen', label: 'Tổng quan bếp', feature: SaasFeature.KITCHEN },
      { href: '/dashboard/kitchen/orders', label: 'Đơn bếp (KDS)', feature: SaasFeature.KITCHEN },
    ],
  },
  {
    label: 'Quản lý ca',
    items: [
      { href: '/dashboard/manager', label: 'Dashboard ca', feature: SaasFeature.SHIFT_MGMT },
      { href: '/dashboard/manager/orders', label: 'Đơn hàng ca', feature: SaasFeature.SHIFT_MGMT },
      { href: '/dashboard/manager/issue', label: 'Cấp phát đầu ca', feature: SaasFeature.SHIFT_MGMT },
      { href: '/dashboard/manager/returns', label: 'Hoàn trả cuối ca', feature: SaasFeature.SHIFT_MGMT },
      { href: '/dashboard/manager/replenish', label: 'Bổ sung tồn', feature: SaasFeature.SHIFT_MGMT },
      { href: '/dashboard/manager/stock', label: 'Tồn kho ca', feature: SaasFeature.SHIFT_MGMT },
    ],
  },
  {
    label: 'Kho',
    items: [
      { href: '/dashboard/warehouse', label: 'Tổng quan kho', feature: SaasFeature.WAREHOUSE },
      { href: '/dashboard/warehouse/replenish', label: 'Bổ sung tồn', feature: SaasFeature.WAREHOUSE },
      { href: '/dashboard/warehouse/stock', label: 'Tồn kho', feature: SaasFeature.WAREHOUSE },
      { href: '/dashboard/warehouse/usage', label: 'Tiêu hao ngày', feature: SaasFeature.WAREHOUSE },
    ],
  },
  {
    label: 'Kế toán',
    items: [
      { href: '/dashboard/accounting', label: 'Tổng quan KT', feature: SaasFeature.ACCOUNTING },
      { href: '/dashboard/accounting/supplier', label: 'Nhập NCC', feature: SaasFeature.ACCOUNTING },
      { href: '/dashboard/accounting/requests', label: 'Duyệt phiếu', feature: SaasFeature.ACCOUNTING },
      { href: '/dashboard/accounting/ledger', label: 'Sao kê', feature: SaasFeature.ACCOUNTING },
    ],
  },
  {
    label: 'Cấu hình cửa hàng',
    items: [
      { href: '/dashboard/admin/menu', label: 'Menu & món', feature: SaasFeature.MENU },
      { href: '/dashboard/admin/toppings', label: 'Topping', feature: SaasFeature.MENU },
      { href: '/dashboard/admin/payments', label: 'Hình thức TT', feature: SaasFeature.PAYMENTS },
      { href: '/dashboard/admin/employees', label: 'Nhân viên', feature: SaasFeature.EMPLOYEES },
    ],
  },
  {
    label: 'Kho & công thức',
    items: [
      { href: '/dashboard/admin/warehouses', label: 'Cấu hình kho', feature: SaasFeature.WAREHOUSE },
      { href: '/dashboard/admin/ingredients', label: 'Nguyên liệu', feature: SaasFeature.WAREHOUSE },
      { href: '/dashboard/admin/recipes', label: 'Công thức', feature: SaasFeature.RECIPE },
      { href: '/dashboard/admin/min-stock', label: 'Tồn tối thiểu', feature: SaasFeature.WAREHOUSE },
      { href: '/dashboard/admin/stock', label: 'Xem tồn', feature: SaasFeature.WAREHOUSE },
      { href: '/dashboard/admin/supplier', label: 'Nhập NCC (admin)', feature: SaasFeature.ACCOUNTING },
      { href: '/dashboard/admin/stock-requests', label: 'Duyệt phiếu', feature: SaasFeature.ACCOUNTING },
      { href: '/dashboard/admin/ledger', label: 'Sao kê (admin)', feature: SaasFeature.ACCOUNTING },
    ],
  },
  {
    label: 'Gói dịch vụ',
    items: [
      { href: '/dashboard/admin/subscription', label: 'Gói đăng ký' },
      { href: '/dashboard/admin/billing', label: 'Thanh toán gói' },
    ],
  },
];

export function filterNavByPlan(
  sections: NavSection[],
  plan: string,
  status: string,
): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.feature || planHasFeature(plan, status, item.feature),
      ),
    }))
    .filter((section) => section.items.length > 0);
}
