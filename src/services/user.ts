const API_URL = import.meta.env.VITE_API_URL;
import axiosInstance from './axiosInstance';
export interface UserInfo {
  customerId: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  mobile: string;
  country: string;
  dob: string;
}
export interface UpdateUserInfoInput {
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
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
export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.get('/auth/me');
    const json = response.data;

    if (json.code !== 200 || !json.data) {
      throw new Error(json.message || 'Lỗi khi lấy thông tin người dùng');
    }

    return json.data as UserInfo;
  } catch (error) {
    console.error('Lỗi khi gọi getUserInfo:', error);
    throw error;
  }
};

/**
 * Gửi cập nhật thông tin người dùng.
 */
export const updateUserInfo = async (
  userInfo: UpdateUserInfoInput
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/auth/update-info', userInfo);
    return response.data as ApiResponse;
  } catch (error) {
    console.error('Lỗi khi gọi updateUserInfo:', error);
    throw error;
  }
};