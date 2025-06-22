import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await authStore.checkAuth();
      if (isAuthenticated) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    };

    checkAuth();
  }, [navigate, authStore]);

  return authStore;
};

// Hook for form validation
export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  validationRules: Record<keyof T, (value: any, formData?: T) => string>
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name: keyof T, value: any): string => {
    const validator = validationRules[name];
    if (validator) {
      return validator(value, formData);
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const fieldKey = key as keyof T;
      const error = validateField(fieldKey, formData[fieldKey]);
      if (error) {
        newErrors[fieldKey] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof T]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const isFieldInvalid = (fieldName: keyof T): boolean => {
    return submitted && !!errors[fieldName];
  };

  const getErrorMessage = (fieldName: keyof T): string => {
    return errors[fieldName] || '';
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setSubmitted(false);
  };

  return {
    formData,
    errors,
    submitted,
    setSubmitted,
    validateForm,
    handleInputChange,
    isFieldInvalid,
    getErrorMessage,
    resetForm,
    setFormData
  };
}; 