// API service configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface LoginData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  dob: string;
  username: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const apiService = {
  // Login method
  async login(loginData: LoginData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Đăng nhập thành công'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Có lỗi xảy ra khi đăng nhập'
      };
    }
  },

  // Register method
  async register(registerData: RegisterData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Đăng ký thành công'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Có lỗi xảy ra khi đăng ký'
      };
    }
  },

  // Check if user is authenticated
  async checkAuth(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token không hợp lệ');
      }

      return {
        success: true,
        data: data.data || data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Xác thực thất bại'
      };
    }
  },

  // Logout method
  async logout(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');

      return {
        success: true,
        message: 'Đăng xuất thành công'
      };
    } catch (error: any) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');

      return {
        success: true,
        message: 'Đăng xuất thành công'
      };
    }
  }
};

export default apiService; 