import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ModernInput, ModernButton } from '../../components';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useLoginRedirect } from '../../hooks/useLoginRedirect';
import RedirectNotification from '../../components/RedirectNotification';
import type { LoginFormData } from '../../types/index';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated } = useAuthStore();
  const { getCartFromAPI } = useCartStore();
  const { redirectAfterLogin } = useLoginRedirect();

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [showRedirectNotification, setShowRedirectNotification] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      redirectAfterLogin();
    }
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setFormData((prev) => ({ ...prev, username: savedUsername, rememberMe: true }));
    }
  }, [isAuthenticated, redirectAfterLogin]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' && 'checked' in e.target
        ? (e.target as HTMLInputElement).checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (submitted) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (validateForm()) {
      const result = await login(formData.username, formData.password, formData.rememberMe);
      if (result?.message) setMessage(result.message);
      if (result?.success) {
        // Đánh dấu phiên hiện tại
        sessionStorage.setItem('current_session', 'active');
        // Lấy giỏ hàng từ API khi đăng nhập thành công
        await getCartFromAPI();
        console.log('Đã lấy giỏ hàng từ API sau khi đăng nhập thành công');
        // Hiển thị thông báo chuyển hướng
        setShowRedirectNotification(true);
        // Redirect dựa trên role sau 3 giây
        setTimeout(() => {
          redirectAfterLogin();
        }, 3000);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <ModernInput
          id="username"
          type="text"
          name="username"
          label="Tên Tài Khoản"
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
          placeholder="Nhập tên tài khoản của bạn"
        />

        <ModernInput
          id="password"
          type="password"
          name="password"
          label="Mật Khẩu"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          placeholder="Nhập mật khẩu của bạn"
        />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <Link to="/auth/forgot-password" className="text-muted small text-decoration-none">
            Quên mật khẩu?
          </Link>
        </div>

        {message && <div className="alert alert-danger">{message}</div>}

        <ModernButton 
          type="submit" 
          variant="primary" 
          size="lg" 
          fullWidth 
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </ModernButton>
      </form>
      
      <RedirectNotification 
        isVisible={showRedirectNotification}
        onClose={() => setShowRedirectNotification(false)}
      />
    </>
  );
};

export default LoginForm;
