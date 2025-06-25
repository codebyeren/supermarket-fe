// Common TypeScript type definitions

export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  street?: string;
  city?: string;
  state?: string;
  country: string;
  homePhone?: string;
  mobile: string;
  email?: string;
  dob?: string;
  username: string;
  password?: string;
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

export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  country: string;
  mobile: string;
  email?: string;
  dob?: string;
  username: string;
  password: string;
  confirmPassword?: string;
} 