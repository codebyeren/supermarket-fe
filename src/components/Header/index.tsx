import React from 'react';
import { FaHeart, FaShoppingCart, FaUser, FaMapMarkerAlt, FaBars, FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
    const isLoggedIn = false;

    return (
        <header>

            <div className="bg-success text-white py-2 w-100" style={{ width: '100vw' }}>
                <div className="container-lg d-flex align-items-center justify-content-between">
                    {/* Logo + Location */}
                    <div className="d-flex align-items-center gap-3">
                        <div className="fw-bold fs-5">LOGO</div>
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
                        {isLoggedIn ? (
                            <div className="d-flex align-items-center">
                                <FaUser className="me-1" />
                                <span style={{ fontSize: '0.9rem' }}>Tài khoản</span>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center" role="button">
                                <FaSignInAlt className="me-1" />
                                <>
                                    <Link to="/login" className="text-white me-2 text-decoration-none">Đăng nhập /</Link>
                                    <Link to="/register" className="text-white text-decoration-none">Đăng ký</Link>
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
