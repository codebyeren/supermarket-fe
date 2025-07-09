// src/pages/Auth/ForgotStep1_SendEmail.tsx
import React, { useState } from 'react';
import { forgotPassword } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ForgotStep1_SendEmail = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    try {
      await forgotPassword({ email });
      navigate('/auth/verify-code', { state: { email } });
    } catch {
      setError('Không thể gửi mã. Hãy kiểm tra email.');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2>Khôi phục mật khẩu</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <label>Email:</label>
      <input className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="btn btn-primary w-100" onClick={handleSendEmail}>Gửi mã xác minh</button>
    </div>
  );
};

export default ForgotStep1_SendEmail;
