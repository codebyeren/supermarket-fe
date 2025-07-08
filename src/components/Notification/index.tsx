// src/components/Notification.tsx
import React, { useEffect, useState } from 'react';

type NotificationProps = {
  message: string;
  duration?: number;
  borderColor?: 'green' | 'red' | 'yellow' | 'gray';

  onClose: () => void;
};

const Notification: React.FC<NotificationProps> = ({
  message,
  duration = 3000,
  borderColor = 'gray',
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); 
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const stylesMap = {
    green: {
      border: '#28a745',
      background: '#e6f4ea',
      icon: '✅',
    },
    red: {
      border: '#dc3545',
      background: '#f8d7da',
      icon: '❌',
    },
    yellow: {
      border: '#ffc107',
      background: '#fff3cd',
      icon: '⚠️',
    },
    gray: {
      border: '#6c757d',
      background: '#f1f3f5',
      icon: 'ℹ️',
    },
  };

  const { border, background, icon } = stylesMap[borderColor] || stylesMap.gray;

  return (
    <div
      style={{
        ...styles.container,
        border: `2px solid ${border}`,
        backgroundColor: background,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-10px)',
      }}
    >
      <span style={styles.icon}>{icon}</span>
      <span style={styles.message}>{message}</span>
      <button style={styles.closeButton} onClick={() => setVisible(false)}>×</button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    padding: '12px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    minWidth: '300px',
    maxWidth: '400px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    fontSize: '15px',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  },
  icon: {
    fontSize: '18px',
    marginRight: '10px',
  },
  message: {
    flex: 1,
    fontWeight: 500,
    color: '#212529',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#333',
    fontSize: '18px',
    cursor: 'pointer',
    lineHeight: 1,
  },
};

export default Notification;
