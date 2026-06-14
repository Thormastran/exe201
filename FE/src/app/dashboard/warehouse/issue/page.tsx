import { redirect } from 'next/navigation';



/** Cấp phát trong ngày — chuyển quản lý cửa hàng */

export default function WarehouseIssueRedirect() {

  redirect('/dashboard/warehouse/replenish');

}


