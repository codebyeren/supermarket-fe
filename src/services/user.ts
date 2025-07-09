import axios from 'axios';
import axiosInstance from './axiosInstance';

export interface UserInfo {
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  homePhone?: string;
  creditCardNumber?: string | null;
  creditCardExpiry?: string | null;
  state?: string;
  city?: string;
  street?: string;
  mobile: string;
  country: string;
  dob: string;
  address?: string | null;
}

export interface UpdateUserInfoInput {
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  creditCardNumber?: string | null;
  creditCardExpiry?: string | null;
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

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface UserInfoResponse extends ApiResponse<UserInfo> {
  data: UserInfo;
}

export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.get('/auth/me');
    const apiResponse = response.data as UserInfoResponse;
    
    if (apiResponse.code === 200 && apiResponse.data) {
      return apiResponse.data;
    } else {
      throw new Error(apiResponse.message || 'Không thể lấy thông tin người dùng');
    }
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
    const response = await axiosInstance.post('/auth/update-info', userInfo);
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
    if (axios.isAxiosError(error)) {
      console.error('Lỗi Axios khi cập nhật địa chỉ:', error.response?.data || error.message);
    } else {
      console.error('Lỗi không xác định khi cập nhật địa chỉ:', error);
    }
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
    const response = await axiosInstance.post('/auth/update-info', paymentInfo);
    return response.data as ApiResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Lỗi Axios khi cập nhật thông tin thanh toán:', error.response?.data || error.message);
    } else {
      console.error('Lỗi không xác định khi cập nhật thông tin thanh toán:', error);
    }
    throw error;
  }
};