import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import '../Auth.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const handleSuccess = () => {
    setTimeout(() => navigate('/auth/login'), 2000);
  };
  return (
    <div className="auth-form-box">
      <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/SPX_Express_logo.png" alt="Logo" className="auth-logo" />
      <h2>Đăng Ký</h2>
      <p>Chào mừng bạn mới!</p>
      <RegisterForm twoColumn />
      <p className="auth-link">
        Đã có tài khoản? <Link to="/auth/login">Đăng nhập tại đây</Link>
      </p>
    </div>
  );
};

export default Register; 