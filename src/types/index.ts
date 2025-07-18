// Common TypeScript type definitions
import type { ReactNode } from 'react';

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
  paymentInfo?: PaymentInfo;
}
export interface Rating {
  ratingId: number;
  customerId: string;
  customerName: string;
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
  parentId?: number | null; // Cho phép null hoặc undefined
  children?: Category[]; // Có thể undefined
}

export interface Brand {
  id: number;
  brandName: string;
  slug: string;
}
export interface AddBrand{
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
  categoryId?: number | null; // Sửa về number hoặc null cho đồng bộ
  brandId?: number | null;
  imageUrl: string;
  quantity: number;
  unitCost?: number;
  totalAmount?: number;
  isFavorite: boolean;
  ratingScore: number;
  promotionId?: number | null; // Thêm trường này cho đồng bộ
  promotionDescription?: string | null;
  giftProductName?: string | null;
  giftProductImg?: string | null;
  giftProductSlug?: string | null;
  giftProductPrice?: number | null;
  promotionType?: string | null;
  discountPercent?: number | null;
  discountAmount?: number | null;
  giftProductId?: number | null;
  minOrderValue?: number | null;
  minOrderQuantity?: number | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  code?: number;
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
  state?: string;
  city?: string;
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

export type PaymentMethod = 'CREDIT_CARD' | 'CASH' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT';
export type OrderStatus = 'PENDING' | 'SHIPPED' | 'CONFIRMED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED';
export type ItemType = 'TAX' | 'FEE' | 'DISCOUNT' | 'GIFT' | 'SHIPPING';
export type PromotionType = 'PERCENT_DISCOUNT' | 'FIXED_DISCOUNT' | 'BUY_ONE_GET_ONE';

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  slug: string;
  imageUrl: string;
  quantity: number;
  promotionId: number | null;
  promotionType: PromotionType | null;
  promotionDescription: string | null;
  discountPercent: number | null;
  discountAmount: number | null;
  giftProductId: number | null;
  giftProductName: string | null;
  giftProductImg: string | null;
  giftProductSlug: string | null;
  minOrderValue: number | null;
  minOrderQuantity: number | null;
}

export interface BillDetail {
  itemType: ItemType;
  amount: number;
  description: string;
}

export interface Order {
  billId: number;
  orderId: number;
  orderStatus: OrderStatus;
  dateOfPurchase: string;
  orderItems: OrderItem[];
  orderAmount: number;
  billAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  billDetails: BillDetail[];
}

export interface CustomerAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  homePhone?: string;
  mobilePhone: string;
  postalCode?: string;
  isDefault?: boolean;
  id?: number;
}

export interface PaymentInfo {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

// Layout
export interface LayoutProps {
  children: ReactNode;
}
export type DashboardData = {
  totalIncome: number;
  totalOrder: number;
  topProductByParentCategory: Record<string, Product[]>;
  revenueChart: { date: string; total: number }[];
};
export interface AddCategory {
  categoryName: string;
  slug: string;
}

export interface Category extends AddCategory {
  id: number;
}