// src/pages/Auth/ForgotStep3_ResetPassword.tsx
import React, { useState } from 'react';
import { changePassword } from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import ModernAuth from '../../components/ModernAuth';
import ModernInput from '../../components/ModernInput';
import ModernButton from '../../components/ModernButton';

const ResetPass = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email, code } = state || {};

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await changePassword({ email, newPassword });
      navigate('/auth/login');
    } catch {
      setError('Không thể đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !code) return <div className="container py-4">Missing authentication information</div>;

  return (
    <ModernAuth
      type="login"
      title="Reset Password"
      subtitle="Enter a new password for your account"
      switchText="Remembered your password?"
      switchLink="/auth/login"
      switchLinkText="Login"
      hideBrand
    >
      <form onSubmit={handleChangePassword}>
        <ModernInput
          name="newPassword"
          label="New password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          error={error}
          required
          placeholder="Enter new password"
        />
        <ModernButton
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Change password
        </ModernButton>
      </form>
    </ModernAuth>
  );
};

export default ResetPass;
