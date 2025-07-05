import React, { useState, useEffect } from 'react';
import { Button, Input, LoadingSpinner } from '../../components';
import { useAuthStore } from '../../stores/authStore';
import type { RegisterFormData } from '../../types/index';
import { validation, getFieldName } from '../../utils/validation';
import Select from 'react-select';

interface RegisterFormProps {
  onSuccess?: () => void;
  twoColumn?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, twoColumn }) => {
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

  const countryOptions = [
    { value: 'VN', label: 'Việt Nam' },
    { value: 'US', label: 'Hoa Kỳ' },
    { value: 'JP', label: 'Nhật Bản' },
    { value: 'KR', label: 'Hàn Quốc' },
    { value: 'CN', label: 'Trung Quốc' },
    { value: 'FR', label: 'Pháp' },
    { value: 'DE', label: 'Đức' },
    { value: 'GB', label: 'Anh' },
    { value: 'SG', label: 'Singapore' },
    { value: 'TH', label: 'Thái Lan' },
    // Add more as needed
  ];

  useEffect(() => () => clearError(), [clearError]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { password, confirmPassword, email, mobile, dob, firstName, lastName, country, username } = formData;

    // First Name
    let error = validation.required(firstName, 'Họ');
    if (!error) error = validation.minLength(firstName, 2, 'Họ');
    if (!error) error = validation.maxLength(firstName, 32, 'Họ');
    if (error) newErrors.firstName = error;

    // Last Name
    error = validation.required(lastName, 'Tên');
    if (!error) error = validation.minLength(lastName, 2, 'Tên');
    if (!error) error = validation.maxLength(lastName, 32, 'Tên');
    if (error) newErrors.lastName = error;

    // Country
    error = validation.required(country, 'Quốc gia');
    if (error) newErrors.country = error;

    // Mobile
    error = validation.required(mobile, 'Di động');
    if (!error) error = validation.phoneNumber(mobile);
    if (error) newErrors.mobile = error;

    // Email (optional, but if provided, must be valid)
    if (email) {
      error = validation.email(email);
      if (error) newErrors.email = error;
    }

    // Date of Birth (optional, but if provided, must be valid)
    if (dob) {
      error = validation.dateOfBirth(dob);
      if (error) newErrors.dob = error;
    }

    // Username
    error = validation.required(username, 'Tên đăng nhập');
    if (!error) error = validation.username(username);
    if (!error) error = validation.minLength(username, 3, 'Tên đăng nhập');
    if (!error) error = validation.maxLength(username, 32, 'Tên đăng nhập');
    if (error) newErrors.username = error;

    // Password
    error = validation.required(password, 'Mật khẩu');
    if (!error) error = validation.password(password);
    if (error) newErrors.password = error;

    // Confirm Password
    error = validation.required(confirmPassword || '', 'Xác nhận mật khẩu');
    if (!error) error = validation.confirmPassword(password ?? '', confirmPassword ?? '');
    if (error) newErrors.confirmPassword = error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    const tempFormData = { ...formData, [name]: value } as any;
    const { password, confirmPassword, email, mobile, dob, firstName, lastName, country, username } = tempFormData;
    switch (name) {
      case 'firstName':
        error = validation.required(firstName, 'Họ') || validation.minLength(firstName, 2, 'Họ') || validation.maxLength(firstName, 32, 'Họ');
        break;
      case 'lastName':
        error = validation.required(lastName, 'Tên') || validation.minLength(lastName, 2, 'Tên') || validation.maxLength(lastName, 32, 'Tên');
        break;
      case 'country':
        error = validation.required(country, 'Quốc gia');
        break;
      case 'mobile':
        error = validation.required(mobile, 'Di động') || validation.phoneNumber(mobile);
        break;
      case 'email':
        if (email) error = validation.email(email);
        break;
      case 'dob':
        if (dob) error = validation.dateOfBirth(dob);
        break;
      case 'username':
        error = validation.required(username, 'Tên đăng nhập') || validation.username(username) || validation.minLength(username, 3, 'Tên đăng nhập') || validation.maxLength(username, 32, 'Tên đăng nhập');
        break;
      case 'password':
        error = validation.required(password, 'Mật khẩu') || validation.password(password);
        break;
      case 'confirmPassword':
        error = validation.required(confirmPassword || '', 'Xác nhận mật khẩu') || validation.confirmPassword(password ?? '', confirmPassword ?? '');
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
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
      <div className={twoColumn ? 'form-grid form-grid-2col' : 'form-grid'}>
        {/* Cột trái */}
        <div>
          <Input name="firstName" label="Họ" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} />
          <Input name="middleName" label="Tên đệm" value={formData.middleName} onChange={handleInputChange} error={errors.middleName} />
          <Input name="lastName" label="Tên" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} />
          <Input name="dob" type="date" label="Ngày sinh" value={formData.dob} onChange={handleInputChange} error={errors.dob} />
          <div className="form-group">
            <label htmlFor="country-select">Quốc gia</label>
            <Select
              inputId="country-select"
              name="country"
              value={countryOptions.find(opt => opt.value === formData.country) || null}
              onChange={option => {
                setFormData(prev => ({ ...prev, country: option ? option.value : '' }));
                validateField('country', option ? option.value : '');
                if (error) clearError();
              }}
              options={countryOptions}
              placeholder="Chọn..."
              classNamePrefix="react-select"
              isSearchable={true}
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 2000 }) }}
            />
            {errors.country && <div className="invalid-feedback" style={{display:'block'}}>{errors.country}</div>}
          </div>
        </div>
        {/* Cột phải */}
        <div>
          <Input name="email" type="email" label="Email" value={formData.email} onChange={handleInputChange} error={errors.email} />
          <Input name="mobile" label="Di động" value={formData.mobile} onChange={handleInputChange} error={errors.mobile} type="tel" inputMode="numeric" />
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
        </div>
      </div>
      <Button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? <><LoadingSpinner size="small" color="#fff" className="me-2" /> Đang xử lý...</> : 'Đăng Ký'}
      </Button>
    </form>
  );
};

export default RegisterForm; 