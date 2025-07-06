import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useCartLogout } from '../../stores/cartStore';

interface JwtPayload {
  sub?: string;
  role?: string;
  [key: string]: any;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // ← Lấy path hiện tại
  const { handleLogout: handleCartLogout } = useCartLogout();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        setUsername(decoded.sub || null);
      }
    } catch (error) {
      console.error('Token không hợp lệ:', error);
      setUsername(null);
    }
  }, []);

  const handleLogout = async () => {
    // Xử lý cart logout trước
    await handleCartLogout();
    // Sau đó xóa token
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    navigate('/auth/loginn');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
  <aside className="bg-white p-4 shadow-sm min-vh-100 d-flex flex-column" style={{ width: '100%', maxWidth: 280 }}>
  <div className="fw-bold fs-5 mb-4">{username || 'Người dùng'}</div>
  <ul className="list-unstyled">
    <li className="mb-3">
      <Link
        to="/user-info"
        className={`text-decoration-none ${isActive('/user-info') ? 'text-primary fw-semibold' : 'text-secondary'}`}
      >
        Thông tin người dùng
      </Link>
    </li>
    <li className="mb-3">
      <Link
        to="/order-history"
        className={`text-decoration-none ${isActive('/order-history') ? 'text-primary fw-semibold' : 'text-secondary'}`}
      >
        Lịch sử đơn hàng
      </Link>
    </li>
    <li className="mb-3">
      <Link
        to="/favorites"
        className={`text-decoration-none ${isActive('/favorites') ? 'text-primary fw-semibold' : 'text-secondary'}`}
      >
        Sản phẩm yêu thích
      </Link>
    </li>
    <li className="mb-3">
      <span
        role="button"
        className="text-decoration-none text-danger"
        onClick={handleLogout}
      >
        Đăng xuất
      </span>
    </li>
  </ul>
</aside>

  );
}
