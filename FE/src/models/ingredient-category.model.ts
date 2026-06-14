export enum IngredientCategory {
  LIQUID = 'LIQUID',
  DRY = 'DRY',
  TOPPING = 'TOPPING',
  OTHER = 'OTHER',
}

export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, string> = {
  [IngredientCategory.LIQUID]: 'Chất lỏng',
  [IngredientCategory.DRY]: 'Khô / bột',
  [IngredientCategory.TOPPING]: 'Topping',
  [IngredientCategory.OTHER]: 'Khác',
};

export const RECIPE_UNIT_HINT: Record<IngredientCategory, string> = {
  [IngredientCategory.LIQUID]: 'ml / ly (VD: 200ml trà, 120ml sữa)',
  [IngredientCategory.DRY]: 'g / ly (VD: 15g đường)',
  [IngredientCategory.TOPPING]: 'g / ly (VD: 40g trân châu)',
  [IngredientCategory.OTHER]: 'theo đơn vị kho',
};

export const CATEGORY_ORDER: IngredientCategory[] = [
  IngredientCategory.LIQUID,
  IngredientCategory.DRY,
  IngredientCategory.TOPPING,
  IngredientCategory.OTHER,
];
