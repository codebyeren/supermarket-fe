import React from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  address?: string;
  dob?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

class AuthStore {
  private state: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  };

  private listeners: Array<(state: AuthState) => void> = [];

  getState(): AuthState {
    return { ...this.state };
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  async login(username: string, password: string, rememberMe = false): Promise<boolean> {
    this.setState({ loading: true, error: null });

    try {
      const response = await apiService.login({ username, password, rememberMe });

      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userData', JSON.stringify(user));

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }

        this.setState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        });

        return true;
      } else {
        this.setState({
          loading: false,
          error: response.error || 'Đăng nhập thất bại'
        });
        return false;
      }
    } catch (error: any) {
      this.setState({
        loading: false,
        error: error.message || 'Có lỗi xảy ra khi đăng nhập'
      });
      return false;
    }
  }

  async register(userData: any): Promise<boolean> {
    this.setState({ loading: true, error: null });

    try {
      const response = await apiService.register(userData);

      if (response.success) {
        this.setState({
          loading: false,
          error: null
        });
        return true;
      } else {
        this.setState({
          loading: false,
          error: response.error || 'Đăng ký thất bại'
        });
        return false;
      }
    } catch (error: any) {
      this.setState({
        loading: false,
        error: error.message || 'Có lỗi xảy ra khi đăng ký'
      });
      return false;
    }
  }

  async logout(): Promise<void> {
    this.setState({ loading: true });

    try {
      await apiService.logout();
      
      this.setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    } catch (error: any) {
      // Even if logout API fails, clear local state
      this.setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    }
  }

  async checkAuth(): Promise<boolean> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.setState({ isAuthenticated: false, user: null });
      return false;
    }

    this.setState({ loading: true });

    try {
      const response = await apiService.checkAuth();

      if (response.success && response.data) {
        this.setState({
          isAuthenticated: true,
          user: response.data,
          loading: false,
          error: null
        });
        return true;
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');

        this.setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        });
        return false;
      }
    } catch (error: any) {
      // Clear storage on error
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');

      this.setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
      return false;
    }
  }

  clearError(): void {
    this.setState({ error: null });
  }
}

// Create singleton instance
const authStore = new AuthStore();

// React hook to use the auth store
export const useAuthStore = () => {
  const [state, setState] = React.useState<AuthState>(authStore.getState());

  React.useEffect(() => {
    const unsubscribe = authStore.subscribe((newState) => {
      setState((prev) => {
        const isEqual =
          prev.isAuthenticated === newState.isAuthenticated &&
          prev.loading === newState.loading &&
          prev.error === newState.error &&
          JSON.stringify(prev.user) === JSON.stringify(newState.user);
  
        return isEqual ? prev : newState;
      });
    });
  
    return unsubscribe;
  }, []);
  

  return {
    ...state,
    login: authStore.login.bind(authStore),
    register: authStore.register.bind(authStore),
    logout: authStore.logout.bind(authStore),
    checkAuth: authStore.checkAuth.bind(authStore),
    clearError: authStore.clearError.bind(authStore)
  };
};

export default authStore; 