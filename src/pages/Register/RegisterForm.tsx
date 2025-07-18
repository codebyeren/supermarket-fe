import React, { useState, useEffect } from 'react';
import { ModernInput, ModernButton } from '../../components';
import { useAuthStore } from '../../stores/authStore';
import type { RegisterFormData } from '../../types/index';
import { validation } from '../../utils/validation';
import { useNavigate } from 'react-router-dom';
import { locationService, type Country, type State, type City } from '../../services/locationService';

interface RegisterFormProps {
  onSuccess?: () => void;
  twoColumn?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, twoColumn }) => {
  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    country: '',
    state: '',
    city: '',
    mobile: '',
    email: '',
    dob: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Location data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      loadStates(formData.country);
      // Reset state and city when country changes
      setFormData(prev => ({ ...prev, state: '', city: '' }));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.country && formData.state) {
      loadCities(formData.country, formData.state);
      // Reset city when state changes
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [formData.country, formData.state]);

  const loadCountries = async () => {
    setLoadingCountries(true);
    try {
      const countriesData = await locationService.getCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadStates = async (countryCode: string) => {
    setLoadingStates(true);
    try {
      const statesData = await locationService.getStates(countryCode);
      setStates(statesData);
    } catch (error) {
      console.error('Error loading states:', error);
    } finally {
      setLoadingStates(false);
    }
  };

  const loadCities = async (countryCode: string, stateCode: string) => {
    setLoadingCities(true);
    try {
      const citiesData = await locationService.getCities(countryCode, stateCode);
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const countryOptions = [
    { value: '', label: 'Select country...' },
    ...countries.map(country => ({
      value: country.code,
      label: `${country.flag || ''} ${country.name}`
    }))
  ];

  const stateOptions = [
    { value: '', label: 'Select state/province...' },
    ...states.map(state => ({
      value: state.code,
      label: state.name
    }))
  ];

  const cityOptions = [
    { value: '', label: 'Select district...' },
    ...cities.map(city => ({
      value: city.name,
      label: city.name
    }))
  ];

  // Tính toán ngày tối đa (18 tuổi trở lên)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // Tính toán ngày tối thiểu (100 tuổi trở xuống)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
  };

  useEffect(() => () => clearError(), [clearError]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { password, confirmPassword, email, mobile, dob, firstName, lastName, country, username } = formData;

    // First Name
    let error = validation.required(firstName, 'First name');
    if (!error) error = validation.minLength(firstName, 2, 'First name');
    if (!error) error = validation.maxLength(firstName, 32, 'First name');
    if (error) newErrors.firstName = error;

    // Last Name
    error = validation.required(lastName, 'Last name');
    if (!error) error = validation.minLength(lastName, 2, 'Last name');
    if (!error) error = validation.maxLength(lastName, 32, 'Last name');
    if (error) newErrors.lastName = error;

    // Country - required
    error = validation.required(country, 'Country');
    if (error) newErrors.country = error;

    // Mobile
    error = validation.required(mobile, 'Mobile');
    if (!error) error = validation.phoneNumber(mobile);
    if (error) newErrors.mobile = error;

    // Email - required
    error = validation.required(email || '', 'Email');
    if (!error) error = validation.email(email || '');
    if (error) newErrors.email = error;

    // Date of Birth - required and age validation
    error = validation.required(dob || '', 'Date of birth');
    if (!error && dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        error = 'You must be at least 18 years old to register';
      } else if (age > 100) {
        error = 'Invalid date of birth';
      }
    }
    if (error) newErrors.dob = error;

    // Username
    error = validation.required(username, 'Username');
    if (!error) error = validation.username(username);
    if (!error) error = validation.minLength(username, 3, 'Username');
    if (!error) error = validation.maxLength(username, 32, 'Username');
    if (error) newErrors.username = error;

    // Password
    error = validation.required(password, 'Password');
    if (!error) error = validation.password(password);
    if (error) newErrors.password = error;

    // Confirm Password
    error = validation.required(confirmPassword || '', 'Confirm password');
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
        error = validation.required(firstName, 'First name') || validation.minLength(firstName, 2, 'First name') || validation.maxLength(firstName, 32, 'First name');
        break;
      case 'lastName':
        error = validation.required(lastName, 'Last name') || validation.minLength(lastName, 2, 'Last name') || validation.maxLength(lastName, 32, 'Last name');
        break;
      case 'country':
        error = validation.required(country, 'Country');
        break;
      case 'mobile':
        error = validation.required(mobile, 'Mobile') || validation.phoneNumber(mobile);
        break;
      case 'email':
        error = validation.required(email || '', 'Email') || validation.email(email || '');
        break;
      case 'dob':
        error = validation.required(dob || '', 'Date of birth');
        if (!error && dob) {
          const birthDate = new Date(dob);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 18) {
            error = 'You must be at least 18 years old to register';
          } else if (age > 100) {
            error = 'Invalid date of birth';
          }
        }
        break;
      case 'username':
        error = validation.required(username, 'Username') || validation.username(username) || validation.minLength(username, 3, 'Username') || validation.maxLength(username, 32, 'Username');
        break;
      case 'password':
        error = validation.required(password, 'Password') || validation.password(password);
        break;
      case 'confirmPassword':
        error = validation.required(confirmPassword || '', 'Confirm password') || validation.confirmPassword(password ?? '', confirmPassword ?? '');
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
    setSuccessMessage('');
    clearError(); // Clear previous errors
    
    if (validate()) {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        setSuccessMessage('Registration successful! You will be redirected to the login page.');
        if (onSuccess) onSuccess();
        // Auto redirect after 2 seconds
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        // Show API error
        if (result.error) {
          setErrors(prev => ({ ...prev, api: result.error || 'An error occurred' }));
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {errors.api && <div className="alert alert-danger">{errors.api}</div>}
      <div className="modern-auth-form-content-grid">
        <ModernInput 
          name="firstName" 
          label="First name" 
          value={formData.firstName || ''} 
          onChange={handleInputChange} 
          error={errors.firstName}
          required
          placeholder="Enter your first name"
        />
        <ModernInput 
          name="middleName" 
          label="Middle name" 
          value={formData.middleName || ''} 
          onChange={handleInputChange} 
          error={errors.middleName}
          placeholder="Enter your middle name (optional)"
        />
        <ModernInput 
          name="lastName" 
          label="Last name" 
          value={formData.lastName || ''} 
          onChange={handleInputChange} 
          error={errors.lastName}
          required
          placeholder="Enter your last name"
        />
        <ModernInput
          name="dob"
          type="date"
          label="Date of birth"
          value={formData.dob || ''}
          onChange={handleInputChange}
          error={errors.dob}
          required
          min={getMinDate()}
          max={getMaxDate()}
        />
        <ModernInput
          name="country"
          label="Country"
          value={formData.country || ''}
          onChange={handleInputChange}
          error={errors.country}
          select
          options={countryOptions}
          disabled={loadingCountries}
          required
        />
        <ModernInput
          name="state"
          label="State/Province"
          value={formData.state || ''}
          onChange={handleInputChange}
          error={errors.state}
          select
          options={stateOptions}
          disabled={!formData.country || loadingStates}
          required
        />
        <ModernInput
          name="city"
          label="District"
          value={formData.city || ''}
          onChange={handleInputChange}
          error={errors.city}
          select
          options={cityOptions}
          disabled={!formData.state || loadingCities}
          required
        />
        <ModernInput 
          name="email" 
          type="email" 
          label="Email" 
          value={formData.email || ''} 
          onChange={handleInputChange} 
          error={errors.email}
          required
          placeholder="Enter your email"
        />
        <ModernInput 
          name="mobile" 
          label="Mobile" 
          value={formData.mobile || ''} 
          onChange={handleInputChange} 
          error={errors.mobile} 
          type="tel" 
          inputMode="numeric"
          required
          placeholder="Enter your phone number"
        />
        <ModernInput 
          name="username" 
          label="Username" 
          value={formData.username || ''} 
          onChange={handleInputChange} 
          error={errors.username}
          required
          placeholder="Create a username"
        />
        <ModernInput 
          name="password" 
          type="password" 
          label="Password" 
          value={formData.password || ''} 
          onChange={handleInputChange} 
          error={errors.password}
          required
          placeholder="Create a strong password"
        />
        <ModernInput 
          name="confirmPassword" 
          type="password" 
          label="Confirm password" 
          value={formData.confirmPassword || ''} 
          onChange={handleInputChange} 
          error={errors.confirmPassword}
          required
          placeholder="Re-enter your password"
        />
      </div>
      <ModernButton 
        type="submit" 
        variant="primary" 
        size="lg" 
        fullWidth 
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Register'}
      </ModernButton>
    </form>
  );
};

export default RegisterForm; 