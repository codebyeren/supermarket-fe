import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#667eea',
  className = '' 
}) => {
  return (
    <div className={`loading-spinner ${size} ${className}`}>
      <div 
        className="spinner" 
        style={{ borderTopColor: color }}
      ></div>
    </div>
  );
};

export default LoadingSpinner; 