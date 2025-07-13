import React from 'react';
import { LoadingSpinner } from '../index';
import './ModernButton.css';

interface ModernButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const ModernButton: React.FC<ModernButtonProps> = ({
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  onClick,
  className = '',
  icon,
  iconPosition = 'left'
}) => {
  const baseClass = 'modern-btn';
  const variantClass = `modern-btn-${variant}`;
  const sizeClass = `modern-btn-${size}`;
  const widthClass = fullWidth ? 'modern-btn-full' : '';
  const loadingClass = loading ? 'modern-btn-loading' : '';
  const disabledClass = disabled || loading ? 'modern-btn-disabled' : '';

  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    loadingClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading && (
        <LoadingSpinner 
          size="small" 
          color="currentColor" 
          className="modern-btn-spinner"
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="modern-btn-icon modern-btn-icon-left">
          {icon}
        </span>
      )}
      
      <span className="modern-btn-content">
        {children}
      </span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="modern-btn-icon modern-btn-icon-right">
          {icon}
        </span>
      )}
    </button>
  );
};

export default ModernButton; 