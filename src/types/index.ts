// Common TypeScript type definitions

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Product {
  productId: number;
  productName: string;
  price: number;
  slug: string;
  status: string;
  brand: number;
  imageUrl: string;
  quantity: number;
  isFavorite: boolean;
  ratingScore: number;
  promotionType: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
  giftProductId?: number | null;
  minOrderValue?: number | null;
  minOrderQuantity?: number | null;
  startDate: string;
  endDate: string;
}



export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
} 