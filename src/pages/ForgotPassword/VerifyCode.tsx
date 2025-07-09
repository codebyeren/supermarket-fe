// src/pages/Auth/ForgotStep2_VerifyCode.tsx
import React, { useState } from 'react';
import { verifyCode } from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const ForgotStep2_VerifyCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const handleVerifyCode = async () => {
    try {
      await verifyCode({ email, code });
      navigate('/auth/reset-password', { state: { email, code } });
    } catch {
      setError('Mã xác minh không hợp lệ.');
    }
  };

  if (!email) return <div className="container py-4">Thiếu thông tin email</div>;

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2>Xác minh mã</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <label>Mã xác minh:</label>
      <input className="form-control mb-3" value={code} onChange={(e) => setCode(e.target.value)} />
      <button className="btn btn-success w-100" onClick={handleVerifyCode}>Xác minh</button>
    </div>
  );
};

export default ForgotStep2_VerifyCode;
