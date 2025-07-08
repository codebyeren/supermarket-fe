import React from 'react';
import { create } from 'zustand';
import { useAuthStore } from './authStore';
import axiosInstance from '../services/axiosInstance';

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  slug: string;
  status: string;
  brand?: string;
  imageUrl: string;
  stock: number;
  quantity: number;
  promotionType?: string | null;
  discountPercent?: number | null;
  discountAmount?: number | null;
  giftProductId?: number | null;
  minOrderValue?: number | null;
  minOrderQuantity?: number | null;
  startDate?: string;
  endDate?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCartFromAPI: () => Promise<void>;
  syncCartToAPI: () => Promise<void>;
  loadCartFromStorage: () => void;
  saveCartToStorage: () => void;
  mergeCart: (apiItems: CartItem[]) => void;
}

const CART_STORAGE_KEY = 'cart_items_v2';
const API_URL = import.meta.env.VITE_API_URL;
const CART_API_URL = `${API_URL}/carts`;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (item: CartItem) => {
    set((state) => {
      const idx = state.items.findIndex(i => i.productId === item.productId);
      let newItems;
      if (idx !== -1) {
        newItems = state.items.map((i, index) =>
          index === idx ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) } : i
        );
      } else {
        newItems = [...state.items, item];
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  removeFromCart: (productId: number) => set((state) => {
    const newItems = state.items.filter(i => i.productId !== productId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    return { items: newItems };
  }),
  updateQuantity: (productId: number, quantity: number) => set((state) => {
    const newItems = state.items.map(i =>
      i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    return { items: newItems };
  }),
  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    set({ items: [] });
  },
  getTotal: () => {
    return get().items.reduce((sum, i) => {
      let price = i.price;
      if (i.discountPercent) price = price * (1 - i.discountPercent / 100);
      return sum + price * i.quantity;
    }, 0);
  },
getCartFromAPI: async () => {
  try {
    const res = await axiosInstance.get('/carts');
    const data = res.data;
    if (data && Array.isArray(data.data)) {
      get().mergeCart(data.data);
    }
  } catch (e) {
    // alert('Không thể lấy giỏ hàng từ server');
  }
},

syncCartToAPI: async () => {
  try {
    await axiosInstance.post('/carts', get().items);
    // alert('Đồng bộ giỏ hàng thành công!');
  } catch (e) {
    // alert('Đồng bộ giỏ hàng thất bại!');
  }
},

  loadCartFromStorage: () => {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      try {
        const items = JSON.parse(raw);
        set({ items });
      } catch {
        set({ items: [] });
      }
    }
  },
  saveCartToStorage: () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(get().items));
  },
  mergeCart: (apiItems: CartItem[]) => {
    // merge logic: ưu tiên quantity lớn hơn, hoặc ghi đè theo BE tuỳ yêu cầu
    set((state) => {
      const merged = [...apiItems];
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(merged));
      return { items: merged };
    });
  },
}));

// Lắng nghe login/logout, auto-save, đồng bộ cart
export function useCartSync() {
  const { isAuthenticated } = useAuthStore();
  const cartStore = useCartStore();

  React.useEffect(() => {
    cartStore.loadCartFromStorage();
  }, []);

  React.useEffect(() => {
    let interval: any;
    if (isAuthenticated) {
      // Khi login: lấy cart từ BE, merge cart
      cartStore.getCartFromAPI();
      // Auto-save định kỳ
      interval = setInterval(() => {
        cartStore.syncCartToAPI();
      }, 5 * 60 * 1000);
    }
    // Bỏ logic xóa cart khi chưa login - chỉ giữ cart trong localStorage
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated]);
}

// Hook riêng để xử lý logout
export function useCartLogout() {
  const cartStore = useCartStore();
  
  const handleLogout = async () => {
    try {
      // Sync cart lên BE trước khi logout
      await cartStore.syncCartToAPI();
    } catch (e) {
      // Ignore error khi logout
    } finally {
      // Xóa cart khỏi localStorage
      cartStore.clearCart();
    }
  };
  
  return { handleLogout };
} 