import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, LoadingSpinner } from '../../components';
import { useAuthStore } from '../../stores/authStore';
import type { LoginFormData } from '../../types/index';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername, rememberMe: true }));
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.username.trim()) newErrors.username = 'Vui lòng nhập tên tài khoản';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (submitted) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (validateForm()) {
      const result = await login(formData.username, formData.password, formData.rememberMe);
      if (result?.message) {
        setMessage(result.message);
      }
      if (result?.success) {
        navigate('/');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        id="username"
        type="text"
        name="username"
        label="Tên Tài Khoản"
        value={formData.username}
        onChange={handleInputChange}
        error={errors.username}
      />
      <Input
        id="password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        label="Mật Khẩu"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
      >
        <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
          <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </span>
      </Input>
      <div className="form-actions">
        <div className="form-check">
          <input 
            type="checkbox" 
            className="form-check-input" 
            id="rememberMe" 
            name="rememberMe" 
            checked={formData.rememberMe} 
            onChange={handleInputChange} 
          />
          <label className="form-check-label" htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
        </div>
        <Link to="/auth/forgot-password" className="forgot-password-link">Quên mật khẩu?</Link>
      </div>
      {message && <div className="alert alert-danger">{message}</div>}
      <Button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? (
          <>
            <LoadingSpinner size="small" color="#fff" className="me-2" />
            Đang xử lý...
          </>
        ) : (
          'Đăng Nhập'
        )}
      </Button>
    </form>
  );
};

export default LoginForm; 