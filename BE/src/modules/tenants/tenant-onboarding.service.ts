import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  IngredientCategory,
  defaultUnitForCategory,
} from '../../common/enums/ingredient-category.enum';
import { MenuItem, MenuItemDocument } from '../menu/schemas/menu-item.schema';
import {
  PaymentMethodConfig,
  PaymentMethodDocument,
} from '../payment-methods/schemas/payment-method.schema';
import { Topping, ToppingDocument } from '../toppings/schemas/topping.schema';
import { Ingredient, IngredientDocument } from '../inventory/schemas/ingredient.schema';
import {
  WarehouseLocation,
  WarehouseLocationDocument,
} from '../inventory/schemas/warehouse-location.schema';
import {
  WarehouseStock,
  WarehouseStockDocument,
} from '../inventory/schemas/warehouse-stock.schema';
import { Branch, BranchDocument } from '../branches/schemas/branch.schema';
import { MENU_IMAGE_BY_NAME } from '../menu/menu-images';

const WAREHOUSES = [
  { code: 'KHO_TONG', name: 'Kho tổng', sortOrder: 0, isKitchenSource: false, isCentralWarehouse: true },
  { code: 'KHO1', name: 'Kho 1 — Quầy / Bếp', sortOrder: 1, isKitchenSource: true, isCentralWarehouse: false },
  { code: 'KHO2', name: 'Kho 2 — Kho khô', sortOrder: 2, isKitchenSource: false, isCentralWarehouse: false },
  { code: 'KHO3', name: 'Kho 3 — Kho lạnh', sortOrder: 3, isKitchenSource: false, isCentralWarehouse: false },
];

const INGREDIENTS = [
  { name: 'Nước trà đen (pha sẵn)', category: IngredientCategory.LIQUID, currentStock: 200_000, minStock: 20_000 },
  { name: 'Sữa tươi', category: IngredientCategory.LIQUID, currentStock: 80_000, minStock: 10_000 },
  { name: 'Đường', category: IngredientCategory.DRY, currentStock: 30_000, minStock: 3_000 },
  { name: 'Trân châu đen', category: IngredientCategory.TOPPING, currentStock: 20_000, minStock: 2_000 },
];

const TOPPINGS = [
  { name: 'Trân châu', price: 5000, sortOrder: 1 },
  { name: 'Thạch dừa', price: 5000, sortOrder: 2 },
];

const MENU = [
  { name: 'Trà sữa trân châu đường đen', category: 'Trà sữa', price: 35000 },
  { name: 'Trà sữa matcha', category: 'Trà sữa', price: 38000 },
  { name: 'Trà đào cam sả', category: 'Trà trái cây', price: 32000 },
];

@Injectable()
export class TenantOnboardingService {
  private readonly logger = new Logger(TenantOnboardingService.name);

  constructor(
    @InjectModel(WarehouseLocation.name)
    private readonly warehouseModel: Model<WarehouseLocationDocument>,
    @InjectModel(Ingredient.name)
    private readonly ingredientModel: Model<IngredientDocument>,
    @InjectModel(WarehouseStock.name)
    private readonly stockModel: Model<WarehouseStockDocument>,
    @InjectModel(MenuItem.name)
    private readonly menuModel: Model<MenuItemDocument>,
    @InjectModel(Topping.name)
    private readonly toppingModel: Model<ToppingDocument>,
    @InjectModel(PaymentMethodConfig.name)
    private readonly paymentModel: Model<PaymentMethodDocument>,
    @InjectModel(Branch.name)
    private readonly branchModel: Model<BranchDocument>,
  ) {}

  async seedTenantData(tenantId: string): Promise<void> {
    const tid = new Types.ObjectId(tenantId);
    const exists = await this.warehouseModel.countDocuments({ tenantId: tid }).exec();
    if (exists > 0) {
      this.logger.log(`Tenant ${tenantId} đã có dữ liệu — bỏ qua seed`);
      return;
    }

    await this.branchModel.create({
      tenantId: tid,
      code: 'MAIN',
      name: 'Chi nhánh chính',
      isDefault: true,
      isActive: true,
    });

    for (const w of WAREHOUSES) {
      await this.warehouseModel.create({ ...w, tenantId: tid, isActive: true });
    }

    const kho1 = await this.warehouseModel.findOne({ tenantId: tid, code: 'KHO1' }).exec();
    const ingredients = await this.ingredientModel.insertMany(
      INGREDIENTS.map((i) => ({
        ...i,
        tenantId: tid,
        unit: defaultUnitForCategory(i.category),
      })),
    );

    if (kho1) {
      for (const ing of ingredients) {
        await this.stockModel.create({
          tenantId: tid,
          warehouseId: kho1._id,
          ingredientId: ing._id,
          currentStock: ing.currentStock,
          minStock: ing.minStock,
        });
      }
    }

    const toppings = await this.toppingModel.insertMany(
      TOPPINGS.map((t) => ({ ...t, tenantId: tid, isActive: true })),
    );

    await this.menuModel.insertMany(
      MENU.map((m) => ({
        ...m,
        tenantId: tid,
        isAvailable: true,
        imageUrl: MENU_IMAGE_BY_NAME[m.name],
        toppingIds: toppings.slice(0, 1).map((t) => t._id),
      })),
    );

    await this.paymentModel.insertMany([
      { tenantId: tid, code: 'CASH', label: 'Tiền mặt', isActive: true, sortOrder: 0 },
      { tenantId: tid, code: 'BANK_TRANSFER', label: 'Chuyển khoản / QR', isActive: true, sortOrder: 1 },
    ]);

    this.logger.log(`Đã seed dữ liệu mẫu cho tenant ${tenantId}`);
  }
}
