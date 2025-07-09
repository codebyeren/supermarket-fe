import axios from 'axios';
import axiosInstance from './axiosInstance';

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
