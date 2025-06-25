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
    <div className="auth-container">
      <div className="auth-form-wrapper" style={{maxWidth: '600px'}}>
        <div className="auth-header">
          <h2>Đăng Ký</h2>
        </div>
        <RegisterForm onSuccess={handleSuccess} />
        <p className="auth-link">
          Đã có tài khoản? <Link to="/auth/login">Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 