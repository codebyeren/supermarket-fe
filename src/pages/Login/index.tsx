import React from 'react';
import { ModernAuth } from '../../components';
import LoginForm from './LoginForm';

const Login: React.FC = () => {
  return (
    <ModernAuth
      type="login"
      title="Đăng Nhập"
      subtitle="Chào mừng bạn quay trở lại!"
      switchText="Chưa có tài khoản?"
      switchLink="/auth/register"
      switchLinkText="Đăng ký ngay"
    >
      <LoginForm />
    </ModernAuth>
  );
};

export default Login; 