import axios from 'axios';
import axiosInstance from './axiosInstance';
import type { CustomerAddress, PaymentInfo } from '../types';

export interface UserInfo {
  customerId: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  mobile: string;
  country: string;
  dob: string;
  street?: string;
  city?: string;
  state?: string;
  homePhone?: string;
  paymentInfo?: PaymentInfo;
}

export interface UpdateUserInfoInput {
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  creditCardNumber: string;
  creditCardExpiry: string;
  mobile: string;
  country: string;
  dob: string;
  street?: string;
  city?: string;
  state?: string;
  homePhone?: string;
}

export interface UpdateAddressInput {
  street: string;
  city: string;
  state: string;
  country: string;
  homePhone?: string;
  mobilePhone: string;
}

export interface UpdatePaymentInfoInput {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface ApiResponse {
  code: number;
  message: string;
  data?: any;
}

export const getUserInfo = async (): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.get('http://localhost:5050/api/auth/me');
    return response.data as ApiResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Lỗi Axios khi gọi getUserInfo:', error.response?.data || error.message);
    } else {
      console.error('Lỗi không xác định khi gọi getUserInfo:', error);
    }
    throw error;
  }
};

export const updateUserInfo = async (
  userInfo: UpdateUserInfoInput
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.put('http://localhost:5050/api/auth/update-info', userInfo);
    return response.data as ApiResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Lỗi Axios khi gọi updateUserInfo:', error.response?.data || error.message);
    } else {
      console.error('Lỗi không xác định khi gọi updateUserInfo:', error);
    }
    throw error;
  }
};

/**
 * Cập nhật thông tin địa chỉ của người dùng.
 */
export const updateUserAddress = async (
  addressInfo: UpdateAddressInput
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/auth/update-info', addressInfo);
    return response.data as ApiResponse;
  } catch (error) {
    console.error('Lỗi khi cập nhật địa chỉ:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin thanh toán của người dùng.
 */
export const updatePaymentInfo = async (
  paymentInfo: UpdatePaymentInfoInput
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/auth/update-payment-info', paymentInfo);
    return response.data as ApiResponse;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin thanh toán:', error);
    throw error;
  }
};