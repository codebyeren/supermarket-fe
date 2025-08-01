import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaShoppingCart, FaUser, FaMapMarkerAlt, FaBars, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartLogout } from '../../stores/cartStore';
import { jwtDecode } from 'jwt-decode';
import type { MyJwtPayload } from '../../types';
import DropdownCart from '../DropdownCart';
import Notification from '../Notification';
import './header.css'
const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout, checkAuth } = useAuthStore();
    const { handleLogout: handleCartLogout } = useCartLogout();
    const [searchValue, setSearchValue] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showDropdownCart, setShowDropdownCart] = useState(false);
    const [dropdownCartPos, setDropdownCartPos] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
    const cartIconRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const decoded = token ? jwtDecode<MyJwtPayload>(token) : null;
    const [cartCount, setCartCount] = useState(0);
    const [showNotification, setShowNotification] = useState(false)



    const updateCartCount = () => {
        const storedItems = localStorage.getItem('cart_items_v2');
        if (storedItems) {
            try {
                const parsed = JSON.parse(storedItems);
                setCartCount(parsed.length || 0);
            } catch {
                setCartCount(0);
            }
        } else {
            setCartCount(0);
        }
    };

    React.useEffect(() => {
        checkAuth();
        updateCartCount();

        const handleUpdate = () => {
            updateCartCount();
        };

        window.addEventListener("storage", handleUpdate);
        window.addEventListener("localstorage_updated", handleUpdate);
        return () => {
            window.removeEventListener("storage", handleUpdate);
            window.removeEventListener("localstorage_updated", handleUpdate);
        };
    }, []);


    const isMobile = windowWidth < 700;

    const handleLogout = async () => {
        await handleCartLogout();
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
        <header style={{ boxShadow: '0 2px 8px #e0f2f1', marginBottom: 2  } } >
            <div className="bg-success text-white py-2 w-100 bg" style={{ width: '100vw', padding: isMobile ? 8 : 0 }}>
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
                        <Link to="/" className="fw-bold fs-5 text-white text-decoration-none" style={{ fontSize: isMobile ? 22 : 26, letterSpacing: 1 }}><img src="../../logo.png" alt="Logo" style={{ width: 100, height: 50 }} /></Link>
                        {!isMobile && (
                            <div className="d-flex align-items-center" style={{ fontSize: 15 }}>
                                <FaMapMarkerAlt className="me-1" />
                                <span style={{ fontSize: '0.95rem' }}>Delivery</span>
                            </div>
                        )}
                    </div>
                    {/* Search bar */}
                    <div style={{ flexGrow: 1, margin: isMobile ? '0 0 10px 0' : '0 32px', width: isMobile ? '100%' : 'auto' }}>
                        <form onSubmit={handleSearch} style={{ width: '100%' }}>
                            <input
                                type="text"
                                className="form-control rounded-pill px-3"
                                placeholder="Search for products.."
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

                        <Link to='/favorites' className='text-white text-decoration-none'>  <FaHeart role="button" style={{ fontSize: isMobile ? 22 : 20 }} />
                        </Link>

                        <div
                            style={{ position: 'relative', display: 'inline-block' }}
                            ref={cartIconRef}
                            onMouseEnter={e => {
                                setShowDropdownCart(true);
                                if (cartIconRef.current) {
                                    const rect = cartIconRef.current.getBoundingClientRect();
                                    setDropdownCartPos({
                                        top: rect.bottom + 4,
                                        left: rect.right - 340 // width của popup
                                    });
                                }
                            }}
                            onMouseLeave={() => setShowDropdownCart(false)}
                        ><div style={{ position: 'relative' }}>
                                <FaShoppingCart
                                    role="button"
                                    style={{ fontSize: isMobile ? 22 : 20 }}
                                    onClick={() => navigate('/cart')}
                                />
                                {cartCount > 0 && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: -6,
                                            right: -10,
                                            backgroundColor: 'red',
                                            color: 'white',
                                            borderRadius: '50%',
                                            padding: '2px 6px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            lineHeight: 1
                                        }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </div>

                            {showDropdownCart && <DropdownCart onClose={() => setShowDropdownCart(false)} position={dropdownCartPos} />}
                        </div>
                        {isAuthenticated ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Link to='user-info' className="fw-bold fs-5 text-white text-decoration-none">    <FaUser className="me-1" />
                                    <span style={{ fontSize: isMobile ? 14 : '0.9rem' }}>
                                        {decoded?.fullName || user?.username || 'User'}
                                    </span></Link>
                                <button onClick={handleLogout} className="btn btn-link text-white p-0 ms-2" style={{ textDecoration: 'none', fontSize: isMobile ? 14 : 16 }}>
                                    <FaSignOutAlt className="me-1" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} role="button">
                                <FaSignInAlt className="me-1" />
                                <>
                                    <Link to="/auth/login" className="text-white me-2 text-decoration-none" style={{ fontSize: isMobile ? 14 : 16 }}>Login /</Link>
                                    <Link to="/auth/register" className="text-white text-decoration-none" style={{ fontSize: isMobile ? 14 : 16 }}>Register</Link>
                                </>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Menu bar chỉ hiện ở desktop/tablet */}
            {!isMobile && (
                <div className="bg-white border-top border-bottom py-2 w-100">
                    <div className="container-lg d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <FaBars />
                            <button className="btn btn-link text-black p-0 ms-2" style={{ textDecoration: 'none', fontSize: isMobile ? 14 : 16 }}>
                                <Link to="/category/all" className="text-black text-decoration-none" style={{ fontSize: isMobile ? 14 : 16 }} >Categories</Link>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
