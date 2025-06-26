import React from 'react';
import { FaHeart, FaShoppingCart, FaUser, FaMapMarkerAlt, FaBars, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate('/auth/login');
    };

    return (
        <header>
            <div className="bg-success text-white py-2 w-100" style={{ width: '100vw' }}>
                <div className="container-lg d-flex align-items-center justify-content-between">
                    {/* Logo + Location */}
                    <div className="d-flex align-items-center gap-3">
                        <Link to="/" className="fw-bold fs-5 text-white text-decoration-none">LOGO</Link>
                        <div className="d-flex align-items-center">
                            <FaMapMarkerAlt className="me-1" />
                            <span style={{ fontSize: '0.9rem' }}>Giao hàng</span>
                        </div>
                    </div>
                    {/* Search bar */}
                    <div className="flex-grow-1 mx-4">
                        <input
                            type="text"
                            className="form-control rounded-pill px-3 w-100"
                            placeholder="Tìm sản phẩm..."
                        />
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        {isAuthenticated ? (
                            <div className="d-flex align-items-center gap-2">
                                <FaUser className="me-1" />
                                <span style={{ fontSize: '0.9rem' }}>
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <button onClick={handleLogout} className="btn btn-link text-white p-0 ms-2" style={{textDecoration: 'none'}}>
                                    <FaSignOutAlt className="me-1" /> Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center" role="button">
                                <FaSignInAlt className="me-1" />
                                <>
                                    <Link to="/auth/login" className="text-white me-2 text-decoration-none">Đăng nhập /</Link>
                                    <Link to="/auth/register" className="text-white text-decoration-none">Đăng ký</Link>
                                </>
                            </div>
                        )}
                        <FaHeart role="button" />
                        <FaShoppingCart role="button" />
                    </div>
                </div>
            </div>
            <div className="bg-white border-top border-bottom py-2 w-100">
                <div className="container-lg d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <FaBars />
                        <strong>Danh Mục</strong>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
