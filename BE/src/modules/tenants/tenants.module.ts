import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from '../branches/schemas/branch.schema';
import { Ingredient, IngredientSchema } from '../inventory/schemas/ingredient.schema';
import {
  WarehouseLocation,
  WarehouseLocationSchema,
} from '../inventory/schemas/warehouse-location.schema';
import {
  WarehouseStock,
  WarehouseStockSchema,
} from '../inventory/schemas/warehouse-stock.schema';
import { MenuItem, MenuItemSchema } from '../menu/schemas/menu-item.schema';
import {
  PaymentMethodConfig,
  PaymentMethodSchema,
} from '../payment-methods/schemas/payment-method.schema';
import { Topping, ToppingSchema } from '../toppings/schemas/topping.schema';
import { Tenant, TenantSchema } from './schemas/tenant.schema';
import { TenantOnboardingService } from './tenant-onboarding.service';
import { TenantsService } from './tenants.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: WarehouseLocation.name, schema: WarehouseLocationSchema },
      { name: Ingredient.name, schema: IngredientSchema },
      { name: WarehouseStock.name, schema: WarehouseStockSchema },
      { name: MenuItem.name, schema: MenuItemSchema },
      { name: Topping.name, schema: ToppingSchema },
      { name: PaymentMethodConfig.name, schema: PaymentMethodSchema },
      { name: Branch.name, schema: BranchSchema },
    ]),
  ],
  providers: [TenantsService, TenantOnboardingService],
  exports: [TenantsService, TenantOnboardingService, MongooseModule],
})
export class TenantsModule {}
