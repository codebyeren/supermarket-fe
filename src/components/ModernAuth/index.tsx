import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../index';
import './ModernAuth.css';

interface ModernAuthProps {
  type: 'login' | 'register';
  children: React.ReactNode;
  title: string;
  subtitle: string;
  switchText: string;
  switchLink: string;
  switchLinkText: string;
  hideBrand?: boolean;
}

const ModernAuth: React.FC<ModernAuthProps> = ({
  type,
  children,
  title,
  subtitle,
  switchText,
  switchLink,
  switchLinkText,
  hideBrand = false
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="modern-auth-container">
      {/* Background Animation */}
      <div className="modern-auth-bg">
        <div className="modern-auth-bg-animation">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`modern-auth-content${hideBrand ? ' no-brand' : ''}`}>
        {/* Left Side - Brand */}
        {!hideBrand && (
          <div className="modern-auth-brand-side">
            <div className="modern-auth-brand-content">
              <div className="modern-auth-logo">
                <div className="modern-auth-logo-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1>SUPERMARKET</h1>
              </div>
              
              <div className="modern-auth-hero">
                <h2>Chào mừng đến với</h2>
                <h3>Hệ thống quản lý siêu thị</h3>
                <p>Nơi mua sắm tiện lợi, chất lượng và giá cả hợp lý</p>
              </div>

              <div className="modern-auth-features">
                <div className="feature-item">
                  <div className="feature-icon">🛒</div>
                  <span>Mua sắm dễ dàng</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🚚</div>
                  <span>Giao hàng nhanh chóng</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💰</div>
                  <span>Giá cả cạnh tranh</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Side - Form */}
        <div className={`modern-auth-form-side${hideBrand ? ' full' : ''}`}>
          <div className="modern-auth-form-container">
            {/* Form Header */}
            <div className="modern-auth-form-header">
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>

            {/* Form Content */}
            <div className="modern-auth-form-content">
              {children}
            </div>

            {/* Form Footer */}
            <div className="modern-auth-form-footer">
              <div className="modern-auth-switch">
                <span>{switchText}</span>
                <Link to={switchLink} className="modern-auth-switch-link">
                  {switchLinkText}
                </Link>
              </div>
              
              <div className="modern-auth-divider">
                <span>hoặc</span>
              </div>

              <div className="modern-auth-social">
                <button className="social-btn google-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Tiếp tục với Google
                </button>
                
                <button className="social-btn facebook-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                  </svg>
                  Tiếp tục với Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAuth; 