import React, { useState } from 'react';
import { FaHeart, FaShoppingCart, FaUser, FaMapMarkerAlt, FaBars, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { jwtDecode } from 'jwt-decode';


const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [searchValue, setSearchValue] = useState("");
    const token  = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const decoded = token ? jwtDecode(token) : null;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const isMobile = windowWidth < 700;

    const handleLogout = async () => {
        await logout();
        navigate('/auth/login');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            navigate(`/search?searchName=${encodeURIComponent(searchValue.trim())}`);
        }
    };

    return (
        <header style={{ boxShadow: '0 2px 8px #e0f2f1', marginBottom: 2 }}>
            <div className="bg-success text-white py-2 w-100" style={{ width: '100vw', padding: isMobile ? 8 : 0 }}>
                <div
                    className="container-lg"
                    style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'stretch' : 'center',
                        justifyContent: 'space-between',
                        gap: isMobile ? 10 : 0
                    }}
                >
                    {/* Logo + Location */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: isMobile ? 'center' : 'flex-start', marginBottom: isMobile ? 8 : 0 }}>
                        <Link to="/" className="fw-bold fs-5 text-white text-decoration-none" style={{ fontSize: isMobile ? 22 : 26, letterSpacing: 1 }}>LOGO</Link>
                        {!isMobile && (
                            <div className="d-flex align-items-center" style={{ fontSize: 15 }}>
                                <FaMapMarkerAlt className="me-1" />
                                <span style={{ fontSize: '0.95rem' }}>Giao hàng</span>
                            </div>
                        )}
                    </div>
                    {/* Search bar */}
                    <div style={{ flexGrow: 1, margin: isMobile ? '0 0 10px 0' : '0 32px', width: isMobile ? '100%' : 'auto' }}>
                        <form onSubmit={handleSearch} style={{ width: '100%' }}>
                            <input
                                type="text"
                                className="form-control rounded-pill px-3"
                                placeholder="Tìm sản phẩm..."
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                style={{
                                    width: '100%',
                                    fontSize: isMobile ? 15 : 16,
                                    padding: isMobile ? '8px 12px' : '10px 18px',
                                    border: 'none',
                                    boxShadow: '0 1px 4px #e0f2f1',
                                    minWidth: isMobile ? 0 : 320
                                }}
                            />
                        </form>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 18, justifyContent: isMobile ? 'center' : 'flex-end', fontSize: isMobile ? 20 : 18 }}>
                        {isAuthenticated ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FaUser className="me-1" />
                                <span style={{ fontSize: isMobile ? 14 : '0.9rem' }}>
                                    {decoded?.sub || user?.username || 'Người dùng'} 
                                </span>
                                <button onClick={handleLogout} className="btn btn-link text-white p-0 ms-2" style={{textDecoration: 'none', fontSize: isMobile ? 14 : 16}}>
                                    <FaSignOutAlt className="me-1" /> Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} role="button">
                                <FaSignInAlt className="me-1" />
                                <>
                                    <Link to="/auth/login" className="text-white me-2 text-decoration-none" style={{ fontSize: isMobile ? 14 : 16 }}>Đăng nhập /</Link>
                                    <Link to="/auth/register" className="text-white text-decoration-none" style={{ fontSize: isMobile ? 14 : 16 }}>Đăng ký</Link>
                                </>
                            </div>
                        )}
                        <Link to = '/favorites' className='text-white text-decoration-none'>  <FaHeart role="button" style={{ fontSize: isMobile ? 22 : 20 }} />
                        </Link>
                      
                        <FaShoppingCart role="button" style={{ fontSize: isMobile ? 22 : 20 }} />
                    </div>
                </div>
            </div>
            {/* Menu bar chỉ hiện ở desktop/tablet */}
            {!isMobile && (
                <div className="bg-white border-top border-bottom py-2 w-100">
                    <div className="container-lg d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <FaBars />
                            <button className="btn btn-link text-black p-0 ms-2" style={{textDecoration: 'none', fontSize: isMobile ? 14 : 16}}>
                            <Link to="/category/all" className="text-black text-decoration-none" style={{ fontSize: isMobile ? 14 : 16 }} >Danh Mục</Link>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
