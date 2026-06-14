export enum IngredientCategory {
  /** Sữa, nước, nước trà pha sẵn — luôn quản lý theo ml */
  LIQUID = 'LIQUID',
  /** Trà khô, đường, bột, đá — theo g */
  DRY = 'DRY',
  /** Trân châu, topping — theo g */
  TOPPING = 'TOPPING',
  OTHER = 'OTHER',
}

export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, string> = {
  [IngredientCategory.LIQUID]: 'Chất lỏng (ml)',
  [IngredientCategory.DRY]: 'Khô / bột (g)',
  [IngredientCategory.TOPPING]: 'Topping (g)',
  [IngredientCategory.OTHER]: 'Khác',
};

/** Đơn vị chuẩn theo loại — tránh admin nhập lẫn đơn vị */
export function defaultUnitForCategory(cat: IngredientCategory): string {
  switch (cat) {
    case IngredientCategory.LIQUID:
      return 'ml';
    default:
      return 'g';
  }
}
