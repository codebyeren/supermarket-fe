import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../index';
import './ResponsiveAuth.css';

interface ResponsiveAuthProps {
  type: 'login' | 'register';
  children: React.ReactNode;
  title: string;
  subtitle: string;
  switchText: string;
  switchLink: string;
  switchLinkText: string;
}

const ResponsiveAuth: React.FC<ResponsiveAuthProps> = ({
  type,
  children,
  title,
  subtitle,
  switchText,
  switchLink,
  switchLinkText
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="responsive-auth-container">
      {/* Left Panel - Image */}
      <div className="responsive-auth-left-panel">
        <div className="responsive-auth-image-wrapper">
          <LazyImage
            src="/banner1.jpg"
            alt="Supermarket Banner"
            className="responsive-auth-image"
            size={{ width: 600, height: 400 }}
            fallbackCategory="banner"
            onLoad={() => setIsImageLoaded(true)}
            loading="eager"
          />
          <div className={`responsive-auth-overlay ${isImageLoaded ? 'loaded' : ''}`}>
            <div className="responsive-auth-brand">
              <h1>SUPERMARKET</h1>
              <p>Quality - Prestige - Best Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="responsive-auth-right-panel">
        <div className="responsive-auth-form-container">
          {/* Logo */}
          <div className="responsive-auth-logo">
            <LazyImage
              src="../../logo.png"
              alt="Logo"
              className="responsive-auth-logo-image"
              size={{ width: 120, height: 60 }}
              fallbackCategory="default"
            />
          </div>

          {/* Header */}
          <div className="responsive-auth-header">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          {/* Form */}
          <div className="responsive-auth-form">
            {children}
          </div>

          {/* Switch Link */}
          <div className="responsive-auth-switch">
            <p>
              {switchText}{' '}
              <Link to={switchLink} className="responsive-auth-switch-link">
                {switchLinkText}
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="responsive-auth-footer">
            <p>&copy; 2024 Supermarket. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Mobile Background */}
      <div className="responsive-auth-mobile-bg">
        <LazyImage
          src="/banner1.jpg"
          alt="Background"
          className="responsive-auth-mobile-image"
          size={{ width: 400, height: 300 }}
          fallbackCategory="banner"
        />
      </div>
    </div>
  );
};

export default ResponsiveAuth;
