// src/pages/Auth/ForgotStep1_SendEmail.tsx
import React, { useState } from 'react';
import { forgotPassword } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import ModernAuth from '../../components/ModernAuth';
import ModernInput from '../../components/ModernInput';
import ModernButton from '../../components/ModernButton';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      navigate('/auth/verify-code', { state: { email } });
    } catch {
      setError('Cannot send code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernAuth
      type="login"
      title="Forgot Password"
      subtitle="Enter your email to receive a verification code"
      switchText="Remembered your password?"
      switchLink="/auth/login"
      switchLinkText="Login"
      hideBrand
    >
      <form onSubmit={handleSendEmail}>
        <ModernInput
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={error}
          required
          placeholder="Enter your email"
        />
        <ModernButton
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Send verification code
        </ModernButton>
      </form>
    </ModernAuth>
  );
};

export default ForgotPass;
