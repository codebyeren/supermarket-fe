import { useState, useEffect } from 'react';
import { getUserFromToken, isAdmin, hasPermission } from '../utils/authUtils';

interface AuthState {
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    username: null,
    role: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = () => {
      const { username, role, isValid } = getUserFromToken();
      
      setAuthState({
        username,
        role,
        isAuthenticated: isValid,
        isAdmin: isValid && (role === 'admin' || role === 'ADMIN'),
        isLoading: false
      });
    };

    checkAuth();

    // Lắng nghe sự kiện storage change để cập nhật khi token thay đổi
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkPermission = (requiredRole: 'admin' | 'user' | 'all') => {
    return hasPermission(requiredRole);
  };

  return {
    ...authState,
    checkPermission
  };
}; 