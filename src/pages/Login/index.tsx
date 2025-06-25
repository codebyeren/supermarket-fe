import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import '../Auth.css';

const Login: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <h2>Đăng Nhập</h2>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>
        <LoginForm />
        <p className="auth-link">
          Chưa có tài khoản?{' '}
          <Link to="/auth/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 