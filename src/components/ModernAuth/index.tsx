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
      <div className="modern-auth-bg">
        <div className="modern-auth-bg-animation">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>
      </div>

      <div className={`modern-auth-content${hideBrand ? ' no-brand' : ''}`}>
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
                <h2>Welcome to</h2>
                <h3>Supermarket Management System</h3>
                <p>Where shopping is convenient, quality is guaranteed, and prices are reasonable</p>
              </div>

              <div className="modern-auth-features">
                <div className="feature-item">
                  <div className="feature-icon">🛒</div>
                  <span>Easy Shopping</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🚚</div>
                  <span>Fast Delivery</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💰</div>
                  <span>Competitive Prices</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`modern-auth-form-side${hideBrand ? ' full' : ''}`}>
          <div className="modern-auth-form-container">
            <div className="modern-auth-form-header">
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>

            <div className="modern-auth-form-content">
              {children}
            </div>

            <div className="modern-auth-form-footer">
              <div className="modern-auth-switch">
                <span>{switchText}</span>
                <Link to={switchLink} className="modern-auth-switch-link">
                  {switchLinkText}
                </Link>
              </div>

        

            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAuth;
