import { apiRequest } from '@/lib/api';
import {
  DailyUsage,
  Ingredient,
  Recipe,
  StockItem,
  SupplierReceipt,
  WarehouseLocation,
  WarehouseOverview,
} from '@/models/inventory.model';
import { ReturnClosureStatus } from '@/models/return-closure.model';
import {
  OperationsDashboard,
  StockRequestStatus,
  StockRequestType,
  StockTransferRequest,
} from '@/models/stock-request.model';

export const InventoryController = {
  getWarehouses(all = false): Promise<WarehouseLocation[]> {
    const q = all ? '?all=true' : '';
    return apiRequest<WarehouseLocation[]>(`/inventory/warehouses${q}`, {
      auth: true,
      cacheTtlMs: 60_000,
    });
  },

  updateWarehouse(
    id: string,
    payload: Partial<{
      name: string;
      description: string;
      sortOrder: number;
      isActive: boolean;
      isKitchenSource: boolean;
      isCentralWarehouse: boolean;
    }>,
  ): Promise<WarehouseLocation> {
    return apiRequest<WarehouseLocation>(`/inventory/warehouses/${id}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateWarehouseStock(
    warehouseId: string,
    ingredientId: string,
    payload: { minStock?: number; currentStock?: number },
  ) {
    return apiRequest<unknown>(
      `/inventory/warehouses/${warehouseId}/stocks/${ingredientId}`,
      {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify(payload),
      },
    );
  },

  getStock(warehouseId?: string): Promise<StockItem[]> {
    const q = warehouseId ? `?warehouseId=${encodeURIComponent(warehouseId)}` : '';
    return apiRequest<StockItem[]>(`/inventory/stock${q}`, {
      auth: true,
      cacheTtlMs: 4_000,
    });
  },

  getOverview(warehouseId?: string): Promise<WarehouseOverview> {
    const q = warehouseId ? `?warehouseId=${encodeURIComponent(warehouseId)}` : '';
    return apiRequest<WarehouseOverview>(`/inventory/overview${q}`, {
      auth: true,
      cacheTtlMs: 8_000,
    });
  },

  createIngredient(payload: {
    name: string;
    category: string;
    unit?: string;
    currentStock?: number;
    minStock?: number;
  }): Promise<Ingredient> {
    return apiRequest<Ingredient>('/inventory/ingredients', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateIngredient(
    id: string,
    payload: Partial<{
      name: string;
      category: string;
      minStock: number;
    }>,
  ): Promise<Ingredient> {
    return apiRequest<Ingredient>(`/inventory/ingredients/${id}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  getIngredients(): Promise<Ingredient[]> {
    return apiRequest<Ingredient[]>('/inventory/ingredients', {
      auth: true,
      cacheTtlMs: 60_000,
    });
  },

  getDailyUsage(date: string, warehouseId?: string): Promise<DailyUsage> {
    const params = new URLSearchParams({ date });
    if (warehouseId) params.set('warehouseId', warehouseId);
    return apiRequest<DailyUsage>(`/inventory/usage/daily?${params}`, {
      auth: true,
    });
  },

  getRecipes(): Promise<Recipe[]> {
    return apiRequest<Recipe[]>('/inventory/recipes', { auth: true });
  },

  upsertRecipe(menuItemId: string, lines: { ingredientId: string; quantity: number }[]) {
    return apiRequest<Recipe>('/inventory/recipes', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ menuItemId, lines }),
    });
  },

  getSupplierReceipts(): Promise<SupplierReceipt[]> {
    return apiRequest<SupplierReceipt[]>('/inventory/supplier-receipts', {
      auth: true,
    });
  },

  getLedger(month: string) {
    return apiRequest<{
      month: string;
      supplierReceipts: SupplierReceipt[];
      stockRequests: StockTransferRequest[];
      summary: { supplierReceiptCount: number; completedRequestCount: number };
    }>(`/inventory/ledger?month=${encodeURIComponent(month)}`, { auth: true });
  },

  getOperationsDashboard(): Promise<OperationsDashboard> {
    return apiRequest<OperationsDashboard>('/inventory/operations-dashboard', {
      auth: true,
      cacheTtlMs: 8_000,
    });
  },

  getStockRequests(filters?: {
    status?: StockRequestStatus;
    type?: StockRequestType;
    businessDate?: string;
    returnClosureStatus?: ReturnClosureStatus;
    parentRequestId?: string;
  }): Promise<StockTransferRequest[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.type) params.set('type', filters.type);
    if (filters?.businessDate) params.set('businessDate', filters.businessDate);
    if (filters?.returnClosureStatus) {
      params.set('returnClosureStatus', filters.returnClosureStatus);
    }
    if (filters?.parentRequestId) params.set('parentRequestId', filters.parentRequestId);
    const q = params.toString() ? `?${params}` : '';
    return apiRequest<StockTransferRequest[]>(`/inventory/stock-requests${q}`, {
      auth: true,
      cacheTtlMs: 10_000,
    });
  },

  getOpenDispatchForReturn(warehouseId: string, businessDate?: string) {
    const params = new URLSearchParams({ warehouseId });
    if (businessDate) params.set('businessDate', businessDate);
    return apiRequest<StockTransferRequest[]>(
      `/inventory/stock-requests/open-dispatch?${params}`,
      { auth: true },
    );
  },

  createStockRequest(payload: {
    type: StockRequestType;
    targetWarehouseId: string;
    permitDocumentNumber: string;
    permitDocumentDate: string;
    businessDate?: string;
    parentRequestId?: string;
    purpose?: string;
    note?: string;
    lines: { ingredientId: string; quantity: number }[];
  }): Promise<StockTransferRequest> {
    return apiRequest<StockTransferRequest>('/inventory/stock-requests', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  reviewStockRequest(
    id: string,
    payload: { approved: boolean; accountingNote?: string; rejectReason?: string },
  ): Promise<StockTransferRequest> {
    return apiRequest<StockTransferRequest>(`/inventory/stock-requests/${id}/review`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  createSupplierReceipt(payload: {
    supplierName: string;
    documentNumber: string;
    documentDate: string;
    warehouseId?: string;
    note?: string;
    lines: { ingredientId: string; quantity: number; unitPrice?: number }[];
  }): Promise<SupplierReceipt> {
    return apiRequest<SupplierReceipt>('/inventory/supplier-receipts', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  transferStock(payload: {
    fromWarehouseId: string;
    toWarehouseId: string;
    note?: string;
    lines: { ingredientId: string; quantity: number }[];
  }) {
    return apiRequest<{ ok: boolean }>('/inventory/transfer', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },
};
