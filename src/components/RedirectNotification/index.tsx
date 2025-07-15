import React, { useState, useEffect } from 'react';
import { isAdmin } from '../../utils/authUtils';

interface RedirectNotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function RedirectNotification({ isVisible, onClose }: RedirectNotificationProps) {
  const [countdown, setCountdown] = useState(3);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      const userRole = isAdmin() ? 'ADMIN' : 'USER';
      setRole(userRole);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      zIndex: 10000,
      minWidth: '300px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontSize: '24px' }}>
          {role === 'ADMIN' ? '👑' : '👤'}
        </span>
        <h4 style={{ margin: 0, fontSize: '18px' }}>
          Login successful!
        </h4>
      </div>

      <p style={{ margin: '10px 0', fontSize: '14px' }}>
        Welcome {role === 'ADMIN' ? 'Admin' : 'User'}!
        Redirecting to {role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}...
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px'
      }}>
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          Auto-redirect in {countdown}s
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
