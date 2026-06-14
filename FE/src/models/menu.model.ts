export interface Topping {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
  toppingIds?: string[];
  toppings: Topping[];
}

export interface CartItem {
  cartLineId: string;
  menuItemId: string;
  name: string;
  basePrice: number;
  toppings: Topping[];
  price: number;
  quantity: number;
  note?: string;
}
