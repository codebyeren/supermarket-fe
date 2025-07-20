// src/pages/Auth/ForgotStep2_VerifyCode.tsx
import React, { useState } from 'react';
import { verifyCode } from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import ModernAuth from '../../components/ModernAuth';
import ModernInput from '../../components/ModernInput';
import ModernButton from '../../components/ModernButton';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyCode({ email, code });
      navigate('/auth/reset-password', { state: { email, code } });
    } catch {
      setError('Mã xác minh không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) return <div className="container py-4">Missing email information</div>;

  return (
    <ModernAuth
      type="login"
      title="Verify Code"
      subtitle="Enter the verification code sent to your email"
      switchText="Remembered your password?"
      switchLink="/auth/login"
      switchLinkText="Login"
      hideBrand
    >
      <form onSubmit={handleVerifyCode}>
        <ModernInput
          name="code"
          label="Verification code"
          value={code}
          onChange={e => setCode(e.target.value)}
          error={error}
          required
          placeholder="Enter verification code"
        />
        <ModernButton
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Verify
        </ModernButton>
      </form>
    </ModernAuth>
  );
};

export default VerifyCode;
