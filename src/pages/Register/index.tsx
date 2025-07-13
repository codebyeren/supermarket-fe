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
      title="Đăng Ký"
      subtitle="Chào mừng bạn mới!"
      switchText="Đã có tài khoản?"
      switchLink="/auth/login"
      switchLinkText="Đăng nhập tại đây"
      hideBrand
    >
      <RegisterForm twoColumn />
    </ModernAuth>
  );
};

export default Register; 