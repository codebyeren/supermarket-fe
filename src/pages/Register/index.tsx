import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ModernAuth } from '../../components';
import RegisterForm from './RegisterForm';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const handleSuccess = () => {
    setTimeout(() => navigate('/auth/login'), 2000);
  };

  return (
    <ModernAuth
      type="register"
      title="Sign Up"
      subtitle="Welcome new user!"
      switchText="Already have an account?"
      switchLink="/auth/login"
      switchLinkText="Login here"
      hideBrand
    >
      <RegisterForm twoColumn />
    </ModernAuth>
  );
};

export default Register;
