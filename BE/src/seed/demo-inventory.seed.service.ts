import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  IngredientCategory,
  defaultUnitForCategory,
} from '../common/enums/ingredient-category.enum';
import { Ingredient, IngredientDocument } from '../modules/inventory/schemas/ingredient.schema';
import { Recipe, RecipeDocument } from '../modules/inventory/schemas/recipe.schema';
import {
  SupplierReceipt,
  SupplierReceiptDocument,
} from '../modules/inventory/schemas/supplier-receipt.schema';
import {
  WarehouseLocation,
  WarehouseLocationDocument,
} from '../modules/inventory/schemas/warehouse-location.schema';
import {
  WarehouseStock,
  WarehouseStockDocument,
} from '../modules/inventory/schemas/warehouse-stock.schema';
import { MenuItem, MenuItemDocument } from '../modules/menu/schemas/menu-item.schema';
import { Topping, ToppingDocument } from '../modules/toppings/schemas/topping.schema';
import {
  DEMO_INGREDIENTS,
  DEMO_MENU_ITEMS,
  DEMO_RECIPES,
  DEMO_STOCK_BY_WAREHOUSE,
  DEMO_SUPPLIER_RECEIPT,
  DEMO_TOPPINGS,
} from './demo-inventory.data';

const NO_TOPPING_CATEGORIES = ['Cà phê'];

@Injectable()
export class DemoInventorySeedService {
  private readonly logger = new Logger(DemoInventorySeedService.name);

  constructor(
    @InjectModel(Ingredient.name)
    private readonly ingredientModel: Model<IngredientDocument>,
    @InjectModel(WarehouseLocation.name)
    private readonly warehouseModel: Model<WarehouseLocationDocument>,
    @InjectModel(WarehouseStock.name)
    private readonly stockModel: Model<WarehouseStockDocument>,
    @InjectModel(MenuItem.name)
    private readonly menuModel: Model<MenuItemDocument>,
    @InjectModel(Topping.name)
    private readonly toppingModel: Model<ToppingDocument>,
    @InjectModel(Recipe.name)
    private readonly recipeModel: Model<RecipeDocument>,
    @InjectModel(SupplierReceipt.name)
    private readonly receiptModel: Model<SupplierReceiptDocument>,
  ) {}

  /** Bổ sung / cập nhật kho, NVL, menu, công thức cho tenant demo */
  async enrichTenant(tenantId: string, slug?: string): Promise<void> {
    const tid = new Types.ObjectId(tenantId);
    const warehouses = await this.warehouseModel.find({ tenantId: tid }).exec();
    if (warehouses.length === 0) {
      this.logger.warn(`Tenant ${slug ?? tenantId} chưa có kho — bỏ qua enrich`);
      return;
    }

    const whByCode = Object.fromEntries(warehouses.map((w) => [w.code, w]));
    const ingMap = await this.upsertIngredients(tid);
    await this.upsertStocks(tid, whByCode, ingMap);
    await this.syncAllIngredientTotals(tid, ingMap, whByCode.KHO1?._id);
    await this.upsertToppings(tid);
    await this.upsertMenu(tid);
    await this.upsertRecipes(tid, ingMap);
    await this.upsertSupplierReceipt(tid, whByCode, ingMap);

    this.logger.log(
      `Đã enrich kho/NVL demo cho ${slug ?? tenantId} (${DEMO_INGREDIENTS.length} NVL, ${DEMO_MENU_ITEMS.length} món)`,
    );
  }

  private async upsertIngredients(tid: Types.ObjectId) {
    const map = new Map<string, Types.ObjectId>();
    for (const item of DEMO_INGREDIENTS) {
      const doc = await this.ingredientModel
        .findOneAndUpdate(
          { tenantId: tid, name: item.name },
          {
            $set: {
              category: item.category,
              unit: defaultUnitForCategory(item.category),
              sku: item.sku,
            },
            $setOnInsert: {
              tenantId: tid,
              name: item.name,
              currentStock: 0,
              minStock: 0,
            },
          },
          { upsert: true, new: true },
        )
        .exec();
      if (doc) map.set(item.name, doc._id);
    }
    return map;
  }

  private async upsertStocks(
    tid: Types.ObjectId,
    whByCode: Record<string, WarehouseLocationDocument>,
    ingMap: Map<string, Types.ObjectId>,
  ) {
    for (const [code, lines] of Object.entries(DEMO_STOCK_BY_WAREHOUSE)) {
      const wh = whByCode[code];
      if (!wh) continue;
      for (const line of lines) {
        const ingId = ingMap.get(line.ingredient);
        if (!ingId) continue;
        await this.stockModel
          .findOneAndUpdate(
            { tenantId: tid, warehouseId: wh._id, ingredientId: ingId },
            {
              $set: {
                currentStock: line.currentStock,
                minStock: line.minStock,
              },
              $setOnInsert: {
                tenantId: tid,
                warehouseId: wh._id,
                ingredientId: ingId,
              },
            },
            { upsert: true },
          )
          .exec();
      }
    }
  }

  private async syncAllIngredientTotals(
    tid: Types.ObjectId,
    ingMap: Map<string, Types.ObjectId>,
    kho1Id?: Types.ObjectId,
  ) {
    for (const ingId of ingMap.values()) {
      const rows = await this.stockModel
        .find({ tenantId: tid, ingredientId: ingId })
        .exec();
      const total = rows.reduce((s, r) => s + r.currentStock, 0);
      const kho1Row = kho1Id
        ? rows.find((r) => r.warehouseId.equals(kho1Id))
        : undefined;
      const minStock =
        kho1Row?.minStock ??
        rows.reduce((m, r) => Math.max(m, r.minStock), 0);
      await this.ingredientModel
        .updateOne({ _id: ingId }, { $set: { currentStock: total, minStock } })
        .exec();
    }
  }

  private async upsertToppings(tid: Types.ObjectId) {
    for (const t of DEMO_TOPPINGS) {
      await this.toppingModel
        .findOneAndUpdate(
          { tenantId: tid, name: t.name },
          {
            $set: { price: t.price, sortOrder: t.sortOrder, isActive: true },
            $setOnInsert: { tenantId: tid, name: t.name },
          },
          { upsert: true },
        )
        .exec();
    }
  }

  private async upsertMenu(tid: Types.ObjectId) {
    const toppings = await this.toppingModel
      .find({ tenantId: tid, isActive: true })
      .exec();
    const allTopIds = toppings.map((t) => t._id);

    for (const m of DEMO_MENU_ITEMS) {
      const toppingIds = NO_TOPPING_CATEGORIES.includes(m.category)
        ? []
        : allTopIds;
      await this.menuModel
        .findOneAndUpdate(
          { tenantId: tid, name: m.name },
          {
            $set: {
              category: m.category,
              price: m.price,
              description: m.description,
              imageUrl: m.imageUrl,
              isAvailable: true,
              toppingIds,
            },
            $setOnInsert: {
              tenantId: tid,
              name: m.name,
              toppings: [],
            },
          },
          { upsert: true },
        )
        .exec();
    }
  }

  private async upsertRecipes(
    tid: Types.ObjectId,
    ingMap: Map<string, Types.ObjectId>,
  ) {
    for (const r of DEMO_RECIPES) {
      const menu = await this.menuModel
        .findOne({ tenantId: tid, name: r.menuName })
        .exec();
      if (!menu) continue;

      const lines = r.lines
        .map((l) => {
          const ingredientId = ingMap.get(l.ingredient);
          if (!ingredientId) return null;
          return { ingredientId, quantity: l.quantity };
        })
        .filter(Boolean) as { ingredientId: Types.ObjectId; quantity: number }[];

      if (lines.length === 0) continue;

      await this.recipeModel
        .findOneAndUpdate(
          { tenantId: tid, menuItemId: menu._id },
          {
            $set: { lines },
            $setOnInsert: { tenantId: tid, menuItemId: menu._id },
          },
          { upsert: true },
        )
        .exec();
    }
  }

  private async upsertSupplierReceipt(
    tid: Types.ObjectId,
    whByCode: Record<string, WarehouseLocationDocument>,
    ingMap: Map<string, Types.ObjectId>,
  ) {
    const exists = await this.receiptModel
      .countDocuments({
        tenantId: tid,
        documentNumber: DEMO_SUPPLIER_RECEIPT.documentNumber,
      })
      .exec();
    if (exists > 0) return;

    const wh = whByCode[DEMO_SUPPLIER_RECEIPT.warehouseCode];
    if (!wh) return;

    const lines = DEMO_SUPPLIER_RECEIPT.lines
      .map((l) => {
        const ingredientId = ingMap.get(l.ingredient);
        if (!ingredientId) return null;
        return {
          ingredientId,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        };
      })
      .filter(Boolean) as {
      ingredientId: Types.ObjectId;
      quantity: number;
      unitPrice: number;
    }[];

    if (lines.length === 0) return;

    const docDate = new Date();
    docDate.setDate(docDate.getDate() - 5);

    await this.receiptModel.create({
      tenantId: tid,
      supplierName: DEMO_SUPPLIER_RECEIPT.supplierName,
      documentNumber: DEMO_SUPPLIER_RECEIPT.documentNumber,
      warehouseId: wh._id,
      warehouseCode: wh.code,
      warehouseName: wh.name,
      documentDate: docDate,
      note: DEMO_SUPPLIER_RECEIPT.note,
      lines,
      createdByName: 'Hệ thống (demo)',
    });
  }
}
