import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components';
import './Home.css';

const Home: React.FC = () => {
  const handleLoginClick = () => {
    // Use the navigation function from App.tsx
    if ((window as any).navigateTo) {
      (window as any).navigateTo('login');
    }
  };

  const handleRegisterClick = () => {
    // Use the navigation function from App.tsx
    if ((window as any).navigateTo) {
      (window as any).navigateTo('register');
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">Chào mừng đến với Supermarket</h1>
          <p className="hero-subtitle">
            Hệ thống quản lý siêu thị hiện đại và tiện lợi
          </p>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h3>Mua sắm dễ dàng</h3>
            <p>Trải nghiệm mua sắm trực tuyến thuận tiện</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h3>Giao hàng nhanh chóng</h3>
            <p>Giao hàng tận nơi trong thời gian ngắn</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Bảo mật thông tin</h3>
            <p>Thông tin cá nhân được bảo vệ an toàn</p>
          </div>
        </div>

        <div className="auth-section">
          <h2>Bắt đầu ngay hôm nay</h2>
          <p>Đăng nhập hoặc tạo tài khoản mới để trải nghiệm</p>
          
          <div className="auth-buttons">
            <Link to="/auth/login" className="btn btn-primary btn-lg me-3">
              <i className="fas fa-sign-in-alt me-2"></i>
              Đăng Nhập
            </Link>
            
            <Link to="/auth/register" className="btn btn-outline-primary btn-lg">
              <i className="fas fa-user-plus me-2"></i>
              Đăng Ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 