// src/pages/Auth/ForgotStep3_ResetPassword.tsx
import React, { useState } from 'react';
import { changePassword } from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const ForgotStep3_ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email, code } = state || {};

  const handleChangePassword = async () => {
    try {
      await changePassword({ email, code, newPassword });
      navigate('/auth/login');
    } catch {
      setError('Không thể đổi mật khẩu. Vui lòng thử lại.');
    }
  };

  if (!email || !code) return <div className="container py-4">Thiếu thông tin xác thực</div>;

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2>Đặt lại mật khẩu</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <label>Mật khẩu mới:</label>
      <input type="password" className="form-control mb-3" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <button className="btn btn-success w-100" onClick={handleChangePassword}>Đổi mật khẩu</button>
    </div>
  );
};

export default ForgotStep3_ResetPassword;
