import React from 'react';
import { debugToken, getUserFromToken, isAdmin } from '../../utils/authUtils';

export default function TokenDebugger() {
  const handleDebug = () => {
    debugToken();
  };

  const handleCheckAuth = () => {
    const userInfo = getUserFromToken();
    console.log('🔍 User Info:', userInfo);
    console.log('👑 Is Admin:', isAdmin());
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 9999,
      background: 'white',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h4>🔧 Token Debugger</h4>
      <button onClick={handleDebug} style={{ margin: '5px', padding: '5px 10px' }}>
        Debug Token
      </button>
      <button onClick={handleCheckAuth} style={{ margin: '5px', padding: '5px 10px' }}>
        Check Auth
      </button>
    </div>
  );
} 