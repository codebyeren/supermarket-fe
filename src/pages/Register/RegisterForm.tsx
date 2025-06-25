import React, { useState, useEffect } from 'react';
import { Button, Input, LoadingSpinner } from '../../components';
import { useAuthStore } from '../../stores/authStore';
import type { RegisterFormData } from '../../types/index';
import { validation, getFieldName } from '../../utils/validation';

const RegisterForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { register, loading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    country: '',
    mobile: '',
    email: '',
    dob: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => () => clearError(), [clearError]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { password } = formData;
    (Object.keys(formData) as (keyof RegisterFormData)[]).forEach((key) => {
      const field = key as keyof typeof validation;
      const value = formData[key] ?? '';
      let error = validation.required(value, getFieldName(key));
      if (!error && validation[field]) {
        error = (validation[field] as (value: string) => string)(value);
      }
      if (key === 'confirmPassword' && !error) {
        error = validation.confirmPassword(password ?? '', value);
      }
      if (error) newErrors[key] = error;
    });
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
        if (onSuccess) onSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-grid">
        <Input name="firstName" label="Họ" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} />
        <Input name="middleName" label="Tên đệm" value={formData.middleName} onChange={handleInputChange} error={errors.middleName} />
        <Input name="lastName" label="Tên" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} />
      </div>
      <Input name="country" label="Quốc gia" value={formData.country} onChange={handleInputChange} error={errors.country} />
      <Input name="mobile" label="Di động" value={formData.mobile} onChange={handleInputChange} error={errors.mobile} />
      <Input name="email" type="email" label="Email" value={formData.email} onChange={handleInputChange} error={errors.email} />
      <Input name="dob" type="date" label="Ngày sinh" value={formData.dob} onChange={handleInputChange} error={errors.dob} />
      <Input name="username" label="Tên đăng nhập" value={formData.username} onChange={handleInputChange} error={errors.username} />
      <Input name="password" type={showPassword ? 'text' : 'password'} label="Mật khẩu" value={formData.password} onChange={handleInputChange} error={errors.password}>
        <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
          <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </span>
      </Input>
      <Input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} label="Xác nhận mật khẩu" value={formData.confirmPassword} onChange={handleInputChange} error={errors.confirmPassword}>
        <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </span>
      </Input>
      <Button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? <><LoadingSpinner size="small" color="#fff" className="me-2" /> Đang xử lý...</> : 'Đăng Ký'}
      </Button>
    </form>
  );
};

export default RegisterForm; 