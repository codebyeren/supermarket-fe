import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set: any, get: any) => ({
  items: [],
  addToCart: (item: CartItem) => {
    set((state: CartState) => {
      const existing = state.items.find((i: CartItem) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i: CartItem) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        };
      }
      return { items: [...state.items, item] };
    });
  },
  removeFromCart: (id: string) => set((state: CartState) => ({ items: state.items.filter((i: CartItem) => i.id !== id) })),
  updateQuantity: (id: string, quantity: number) => set((state: CartState) => ({
    items: state.items.map((i: CartItem) => i.id === id ? { ...i, quantity } : i)
  })),
  clearCart: () => set({ items: [] }),
  getTotal: () => get().items.reduce((sum: number, i: CartItem) => sum + i.price * i.quantity, 0)
})); 