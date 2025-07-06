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
export interface Rating {
  ratingId: number;
  customerId: string;
  customerName : string;
  productId: number;
  ratingScore: number;
  comment: string;
  createdAt: string;
}
export interface PostRatingPayload {
  productId?: number;
  ratingScore: number;
  comment: string;
}
export interface Category {
  id: number;
  categoryName: string;
  slug: string;
  children: Category[];
}

export interface Brand {
  id: number;
  brandName: string;
  slug: string;
}

export interface Product {
  productId: number;
  productName: string;
  price: number;
  slug: string;
  status: string;
  brand: string;
  imageUrl: string;
  quantity: number;
  isFavorite: boolean;
  ratingScore: number;
  promotionType: string | null;
  discountPercent: number | null;
  discountAmount: number | null;
  giftProductId: number | null;
  minOrderValue: number | null;
  minOrderQuantity: number | null;
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
export type MyJwtPayload = {
  id: string;
  sub: string;
  fullName: string;
  role: string;
  exp: number;
  iss: string;
  aud: string;
};
