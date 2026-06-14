import { IngredientCategory } from './ingredient-category.model';

export interface WarehouseLocation {
  id: string;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  isKitchenSource: boolean;
  isCentralWarehouse?: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  category: IngredientCategory;
  currentStock: number;
  minStock: number;
  isActive?: boolean;
}

export interface StockItem extends Ingredient {
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  isLow: boolean;
  displayStock: number;
  displayUnit: string;
  displayMinStock: number;
}

export interface WarehouseOverview {
  warehouseId: string;
  lowCount: number;
  totalItems: number;
  liquidLow: number;
  todayUsageLines: number;
  todayReceiptCount: number;
  byCategory: Record<IngredientCategory, StockItem[]>;
  warehouses: WarehouseLocation[];
}

export interface RecipeLine {
  ingredientId: string;
  quantity: number;
  ingredientName?: string;
  unit?: string;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  lines: RecipeLine[];
}

export interface SupplierReceiptLine {
  ingredientId: string;
  quantity: number;
  unitPrice?: number;
}

export interface SupplierReceipt {
  id: string;
  supplierName: string;
  documentNumber: string;
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  documentDate: string;
  note?: string;
  lines: SupplierReceiptLine[];
  createdByName?: string;
  createdAt?: string;
}

export interface DailyUsageItem {
  ingredientId: string;
  name: string;
  unit: string;
  totalUsed: number;
}

export interface DailyUsage {
  date: string;
  items: DailyUsageItem[];
  movementCount: number;
}
