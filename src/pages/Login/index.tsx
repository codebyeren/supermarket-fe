import React from 'react';
import { ModernAuth } from '../../components';
import LoginForm from './LoginForm';

const Login: React.FC = () => {
  return (
    <ModernAuth
      type="login"
      title="Login"
      subtitle="Welcome back!"
      switchText="Don't have an account?"
      switchLink="/auth/register"
      switchLinkText="Register now"
    >
      <LoginForm />
    </ModernAuth>
  );
};

export default Login;
