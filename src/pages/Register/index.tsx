import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, LoadingSpinner } from '../../components';
import { useAuthStore } from '../../stores/authStore';
import { validation, fieldNames, getFieldName } from '../../utils/validation';
import '../Auth.css';

interface RegisterFormData {
  [key: string]: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '', lastName: '', phoneNumber: '', email: '', 
    address: '', dob: '', username: '', password: '', confirmPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
        return;
      }
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => () => clearError(), [clearError]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { password } = formData;
    
    for (const key in formData) {
      const field = key as keyof typeof validation;
      let error = validation.required(formData[key], getFieldName(key));
      if (!error && validation[field]) {
        error = (validation[field] as (value: string) => string)(formData[key]);
      }
      if (key === 'confirmPassword' && !error) {
        error = validation.confirmPassword(password, formData[key]);
      }
      if (error) newErrors[key] = error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitted) setErrors(prev => ({ ...prev, [name]: '' }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSuccessMessage('');
    if (validate()) {
      const { confirmPassword, ...registerData } = formData;
      const success = await register(registerData);
      if (success) {
        setSuccessMessage('Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.');
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper" style={{maxWidth: '600px'}}>
        <div className="auth-header">
          <h2>Đăng Ký</h2>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
        
          <div className="form-grid">
            <Input name="firstName" label="Họ" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} />
            <Input name="lastName" label="Tên" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} />
          </div>
          
          <Input name="phoneNumber" type="tel" label="Số Điện Thoại" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} />
          <Input name="email" type="email" label="Email" value={formData.email} onChange={handleInputChange} error={errors.email} />
          <Input name="address" label="Địa Chỉ" value={formData.address} onChange={handleInputChange} error={errors.address} />
          <Input name="dob" type="date" label="Ngày Sinh" value={formData.dob} onChange={handleInputChange} error={errors.dob} />
          <Input name="username" label="Tên Đăng Nhập" value={formData.username} onChange={handleInputChange} error={errors.username} />
          
          <Input name="password" type={showPassword ? 'text' : 'password'} label="Mật Khẩu" value={formData.password} onChange={handleInputChange} error={errors.password}>
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
          </Input>

          <Input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} label="Xác Nhận Mật Khẩu" value={formData.confirmPassword} onChange={handleInputChange} error={errors.confirmPassword}>
            <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
          </Input>
          
          <Button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <><LoadingSpinner size="small" color="#fff" className="me-2" /> Đang xử lý...</> : 'Đăng Ký'}
          </Button>
        </form>

        <p className="auth-link">
          Đã có tài khoản? <Link to="/auth/login">Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 