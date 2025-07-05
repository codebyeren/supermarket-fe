import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import '../Auth.css';

const Login: React.FC = () => {
  return (
    <div className="auth-form-box auth-bg">
      <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/SPX_Express_logo.png" alt="Logo" className="auth-logo" />
      <h2>Đăng Nhập</h2>
      <p>Chào mừng bạn quay trở lại!</p>
      <LoginForm />
      <p className="auth-link">
        Chưa có tài khoản?{' '}
        <Link to="/auth/register">Đăng ký ngay</Link>
      </p>
    </div>
  );
};

export default Login; 