import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub?: string;
  role?: string;
  exp?: number;
  [key: string]: any;
}

/**
 * Lấy thông tin user từ JWT token
 */
export const getUserFromToken = (): { username: string | null; role: string | null; isValid: boolean } => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  if (!token) {
    return { username: null, role: null, isValid: false };
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Kiểm tra token có hết hạn không
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return { username: null, role: null, isValid: false };
    }

    return {
      username: decoded.sub || null,
      role: decoded.role || null,
      isValid: true
    };
  } catch (error) {
    console.error('Token không hợp lệ:', error);
    return { username: null, role: null, isValid: false };
  }
};

/**
 * Kiểm tra user có phải admin không
 */
export const isAdmin = (): boolean => {
  const { role, isValid } = getUserFromToken();
  return isValid && (role === 'admin' || role === 'ADMIN');
};

/**
 * Kiểm tra user có quyền truy cập không
 */
export const hasPermission = (requiredRole: 'admin' | 'user' | 'all'): boolean => {
  if (requiredRole === 'all') return true;
  
  const { role, isValid } = getUserFromToken();
  if (!isValid) return false;
  
  // Hỗ trợ cả chữ hoa và chữ thường
  if (requiredRole === 'admin') {
    return role === 'admin' || role === 'ADMIN';
  }
  
  return role === requiredRole;
};

/**
 * Lấy username từ token
 */
export const getUsername = (): string | null => {
  const { username } = getUserFromToken();
  return username;
};

/**
 * Lấy role từ token
 */
export const getRole = (): string | null => {
  const { role } = getUserFromToken();
  return role;
};

/**
 * Kiểm tra token có hợp lệ không
 */
export const isTokenValid = (): boolean => {
  const { isValid } = getUserFromToken();
  return isValid;
};

/**
 * Xóa tất cả thông tin auth
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userData');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('current_session');
}; 

/**
 * Debug function để kiểm tra token
 */
export const debugToken = () => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  if (!token) {
    console.log('❌ Không tìm thấy token');
    return;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    console.log('🔍 Token decoded:', decoded);
    console.log('👤 Username:', decoded.sub);
    console.log('🔑 Role:', decoded.role);
    console.log('⏰ Expires:', new Date(decoded.exp! * 1000).toLocaleString());
    console.log('✅ Token hợp lệ:', decoded.exp! * 1000 > Date.now());
    console.log('👑 Is Admin:', decoded.role === 'admin' || decoded.role === 'ADMIN');
  } catch (error) {
    console.error('❌ Token không hợp lệ:', error);
  }
}; 