import type { LoginFormData, RegisterFormData } from '../types/index';
import axiosInstance from './axiosInstance';

// API service configuration
const API_URL = import.meta.env.VITE_API_URL;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

function setTokens(accessToken: string, refreshToken: string, rememberMe: boolean) {
  if (rememberMe) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
  }
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userData');
}

async function fetchWithAuth(url: string, options: RequestInit = {}, retry = true): Promise<Response> {
  let token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  if (!options.headers) options.headers = {};
  (options.headers as any)['Authorization'] = `Bearer ${token}`;
  (options.headers as any)['Content-Type'] = 'application/json';
  let response = await fetch(url, options);
  if (response.status === 401 && retry) {
    // Try refresh token
    const refreshed = await apiService.refreshToken();
    if (refreshed.success) {
      token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      (options.headers as any)['Authorization'] = `Bearer ${token}`;
      response = await fetch(url, options);
    } else {
      clearTokens();
    }
  }
  return response;
}

export const apiService = {
  // Login method
  async login(loginData: LoginFormData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (!response.ok) throw { message: data.message || 'Đăng nhập thất bại' };
      setTokens(data.data.accessToken, data.data.refreshToken, loginData.rememberMe);
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Đăng nhập thành công'
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Có lỗi xảy ra khi đăng nhập' };
    }
  },

  // Register method
  async register(registerData: RegisterFormData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại');
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Đăng ký thành công'
      };
    } catch (error: any) {
      return { success: false, error: error.message || 'Có lỗi xảy ra khi đăng ký' };
    }
  },

  // Check if user is authenticated
  async checkAuth(): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithAuth(`${API_URL}/auth/me`, { method: 'GET' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Token không hợp lệ');
      return { success: true, data: data.data || data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Xác thực thất bại' };
    }
  },

  async refreshToken(): Promise<ApiResponse<any>> {
    try {
      const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('Không có refresh token');
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Refresh token thất bại');
      setTokens(data.data.accessToken, data.data.refreshToken, !!localStorage.getItem('refreshToken'));
      return { success: true, data: data.data };
    } catch (error: any) {
      clearTokens();
      return { success: false, error: error.message || 'Refresh token thất bại' };
    }
  },

  // Logout method
  async logout(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetchWithAuth(`${API_URL}/auth/logout`, { method: 'POST' });
      }
      clearTokens();
      return { success: true, message: 'Đăng xuất thành công' };
    } catch (error: any) {
      clearTokens();
      return { success: true, message: 'Đăng xuất thành công' };
    }
  }
};
export const forgotPassword = (payload: { email: string }) => {
  return axiosInstance.post('/auth/forgot-password', payload);
};

export const verifyCode = (payload: { email: string; code: string }) => {
  return axiosInstance.post('/auth/verify-code', payload);
};

export const changePassword = (payload: { email: string; newPassword: string }) => {
  return axiosInstance.post('/auth/reset-password', payload);
};
export default apiService; 