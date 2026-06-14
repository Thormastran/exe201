import { CartItem, MenuItem, Topping } from '@/models/menu.model';

export function toppingsKey(toppings: Topping[]): string {
  return toppings
    .map((t) => t.name)
    .sort()
    .join('|');
}

export function unitPrice(basePrice: number, toppings: Topping[]): number {
  return basePrice + toppings.reduce((sum, t) => sum + t.price, 0);
}

export function buildCartLine(
  item: MenuItem,
  toppings: Topping[],
  quantity = 1,
): CartItem {
  const tops = [...toppings];
  return {
    cartLineId: `${item.id}-${toppingsKey(tops)}-${Date.now()}`,
    menuItemId: item.id,
    name: item.name,
    basePrice: item.price,
    toppings: tops,
    price: unitPrice(item.price, tops),
    quantity,
  };
}

export function findMatchingLine(
  cart: CartItem[],
  menuItemId: string,
  toppings: Topping[],
): CartItem | undefined {
  const key = toppingsKey(toppings);
  return cart.find(
    (c) => c.menuItemId === menuItemId && toppingsKey(c.toppings) === key,
  );
}

export function cartSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function formatToppingsLabel(toppings: Topping[]): string {
  if (!toppings.length) return '';
  return toppings.map((t) => t.name).join(', ');
}
