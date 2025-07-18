// Common validation functions
export const validation = {
  // Check if field is required
  required: (value: string, fieldName: string): string => {
    if (!value || !value.trim()) {
      return `${fieldName} not empty`;
    }
    return '';
  },

  // Email validation
  email: (value: string): string => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email invalid';
    }
    return '';
  },

  // Phone number validation (Vietnamese format)
  phoneNumber: (value: string): string => {
    if (!value) return '';
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
      return 'Phone number must be 10 digits';
    }
    return '';
  },

  // Username validation
  username: (value: string): string => {
    if (!value) return '';
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!/^[a-zA-Z0-9_-]*$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
  },

  // Password validation
  password: (value: string): string => {
    if (!value) return '';
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$.!%*#?&]{6,}$/.test(value)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return '';
  },

  // Confirm password validation
  confirmPassword: (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return '';
    if (password !== confirmPassword) {
      return 'Confirm password does not match';
    }
    return '';
  },

  // Date of birth validation
  dateOfBirth: (value: string): string => {
    if (!value) return '';
    const dob = new Date(value);
    const today = new Date();
    
    if (isNaN(dob.getTime())) {
      return 'Date of birth is invalid';
    }
    
    if (dob > today) {
      return 'Date of birth cannot be in the future';
    }
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    if (age < 10) {
      return 'You must be at least 10 years old to register';
    }
    if (age > 100) {
      return 'Date of birth is invalid (maximum age is 100)';
    }
    return '';
  },

  // Min length validation
  minLength: (value: string, minLength: number, fieldName: string): string => {
    if (!value) return '';
    if (value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
    return '';
  },

  // Max length validation
  maxLength: (value: string, maxLength: number, fieldName: string): string => {
    if (!value) return '';
    if (value.length > maxLength) {
      return `${fieldName} cannot exceed ${maxLength} characters`;
    }
    return '';
  }
};

// Field name mappings
export const fieldNames: { [key: string]: string } = {
  firstName: 'First name',
  lastName: 'Last name',
  phoneNumber: 'Phone number',
  email: 'Email',
  address: 'Address',
  dob: 'Date of birth',
  username: 'Username',
  password: 'Password',
  confirmPassword: 'Confirm password'
};

// Get field name for display
export const getFieldName = (fieldKey: string): string => {
  return fieldNames[fieldKey] || fieldKey;
}; 