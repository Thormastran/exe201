'use client';



import Link from 'next/link';

import { BRAND } from '@/lib/brand';

import {

  InventoryPageHeader,

  ModuleCard,

  WorkflowSteps,

} from '@/views/inventory/inventory-ui';

import { OperationsDashboardPanel } from '@/views/shared/OperationsDashboardPanel';

import { ManagerLayout } from './ManagerLayout';



const MODULES = [

  {

    href: '/dashboard/manager/issue',

    title: 'Cấp phát đầu ca',

    desc: 'Xin NL từ kho tổng — có PXK',

    icon: '📤',

  },

  {

    href: '/dashboard/manager/returns',

    title: 'Hoàn trả cuối ca',

    desc: 'Gắn mã phiếu cấp phát',

    icon: '📥',

  },

  {

    href: '/dashboard/manager/orders',

    title: 'Đơn hàng hôm nay',

    desc: 'Theo dõi thu ngân & bếp',

    icon: '🧾',

  },

  {

    href: '/dashboard/manager/stock',

    title: 'Tồn kho',

    desc: 'KHO1 bếp · KHO2 · KHO3',

    icon: '📦',

  },

];



export function ManagerHomeView() {

  return (

    <ManagerLayout>

      <div className="space-y-6">

        <InventoryPageHeader

          theme="warehouse"

          badge="Quản lý cửa hàng"

          title="Vận hành cửa hàng"

          subtitle="Luồng ca: cấp phát đầu ca → bán hàng / bếp → hoàn trả cuối ca. Kế toán duyệt mới cập nhật tồn."

        />



        <OperationsDashboardPanel
          warehouseHref="/dashboard/manager/returns"
          accountingHref="/dashboard/accounting/requests"
        />

        <WorkflowSteps theme="warehouse" />

        <div className="grid gap-4 sm:grid-cols-2">
          {MODULES.map((m) => (
            <ModuleCard key={m.href} theme="warehouse" {...m} />
          ))}

        </div>



        <div className={`rounded-xl border ${BRAND.primarySoft} p-4 text-sm`}>

          <p className="font-semibold">Chốt ca nhanh</p>

          <p className="mt-1 text-stone-600">

            Trước khi kết ca, kiểm tra dashboard: phiếu cấp phát còn trạng thái{' '}

            <strong>Chờ hoàn trả</strong> phải lập hoàn trả.

          </p>

          <Link

            href="/dashboard/manager/returns"

            className={`mt-3 inline-flex rounded-lg px-4 py-2 text-sm font-medium text-white ${BRAND.primary}`}

          >

            Mở hoàn trả cuối ca →

          </Link>

        </div>

      </div>

    </ManagerLayout>

  );

}


