import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearAuthData } from '../../utils/authUtils';
import { useAuthState } from '../../hooks/useAuthState';
import './AdminSidebar.css';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  requiredRole: 'admin' | 'user' | 'all';
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: '📊', requiredRole: 'admin' },
  { id: 'users', label: 'User Management', path: '/admin/users', icon: '👥', requiredRole: 'admin' },
  { id: 'products', label: 'Product Management', path: '/admin/products', icon: '📦', requiredRole: 'admin' },
  { id: 'categories', label: 'Category Management', path: '/admin/categories', icon: '📂', requiredRole: 'admin' },
  { id: 'brands', label: 'Brand Management', path: '/admin/brands', icon: '🏷️', requiredRole: 'admin' },
  { id: 'bills', label: 'Bill Management', path: '/admin/bills', icon: '🧾', requiredRole: 'admin' },
  { id: 'promotions', label: 'Promotion Management', path: '/admin/promotions', icon: '🎉', requiredRole: 'admin' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, role: userRole, isAdmin, isLoading } = useAuthState();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    clearAuthData();
    navigate('/auth/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const hasPermission = (requiredRole: string) => {
    if (requiredRole === 'all') return true;
    if (requiredRole === 'admin') return isAdmin;
    return userRole === requiredRole;
  };

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.requiredRole));

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="admin-mobile-toggle">
        <button 
          className="admin-mobile-toggle-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="admin-mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-toggle" onClick={toggleSidebar}>
            <span className="toggle-icon">☰</span>
          </div>
          {!isCollapsed && (
            <div className="admin-sidebar-title">
              <h3>Admin Panel</h3>
              <p className="admin-username">{username || 'Admin'}</p>
            </div>
          )}
        </div>

        <nav className="admin-sidebar-nav">
          <ul className="admin-menu-list">
            {filteredMenuItems.map((item) => (
              <li key={item.id} className="admin-menu-item">
                <Link
                  to={item.path}
                  className={`admin-menu-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className="admin-menu-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="admin-menu-label">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <button 
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <span className="logout-icon">🚪</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
