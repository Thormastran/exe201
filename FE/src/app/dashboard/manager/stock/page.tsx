import { StockDashboardView } from '@/views/warehouse/StockDashboardView';

import { ManagerLayout } from '@/views/manager/ManagerLayout';



export default function ManagerStockPage() {

  return (

    <ManagerLayout>

      <StockDashboardView embedded />

    </ManagerLayout>

  );

}


