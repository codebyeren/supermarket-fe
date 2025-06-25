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
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
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