// Common validation functions
export const validation = {
  // Check if field is required
  required: (value: string, fieldName: string): string => {
    if (!value || !value.trim()) {
      return `${fieldName} không được để trống`;
    }
    return '';
  },

  // Email validation
  email: (value: string): string => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email không hợp lệ';
    }
    return '';
  },

  // Phone number validation (Vietnamese format)
  phoneNumber: (value: string): string => {
    if (!value) return '';
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
      return 'Số điện thoại phải có 10 chữ số';
    }
    return '';
  },

  // Username validation
  username: (value: string): string => {
    if (!value) return '';
    if (value.length < 3) {
      return 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (!/^[a-zA-Z0-9_-]*$/.test(value)) {
      return 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }
    return '';
  },

  // Password validation
  password: (value: string): string => {
    if (!value) return '';
    if (value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$.!%*#?&]{6,}$/.test(value)) {
      return 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt';
    }
    return '';
  },

  // Confirm password validation
  confirmPassword: (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return '';
    if (password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return '';
  },

  // Date of birth validation
  dateOfBirth: (value: string): string => {
    if (!value) return '';
    const dob = new Date(value);
    const today = new Date();
    
    if (isNaN(dob.getTime())) {
      return 'Ngày sinh không hợp lệ';
    }
    
    if (dob > today) {
      return 'Ngày sinh không thể là ngày trong tương lai';
    }
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    if (age < 10) {
      return 'Bạn phải đủ 10 tuổi để đăng ký';
    }
    if (age > 100) {
      return 'Ngày sinh không hợp lệ (tuổi tối đa là 100)';
    }
    return '';
  },

  // Min length validation
  minLength: (value: string, minLength: number, fieldName: string): string => {
    if (!value) return '';
    if (value.length < minLength) {
      return `${fieldName} phải có ít nhất ${minLength} ký tự`;
    }
    return '';
  },

  // Max length validation
  maxLength: (value: string, maxLength: number, fieldName: string): string => {
    if (!value) return '';
    if (value.length > maxLength) {
      return `${fieldName} không được vượt quá ${maxLength} ký tự`;
    }
    return '';
  }
};

// Field name mappings
export const fieldNames: { [key: string]: string } = {
  firstName: 'Họ',
  lastName: 'Tên',
  phoneNumber: 'Số điện thoại',
  email: 'Email',
  address: 'Địa chỉ',
  dob: 'Ngày sinh',
  username: 'Tên đăng nhập',
  password: 'Mật khẩu',
  confirmPassword: 'Xác nhận mật khẩu'
};

// Get field name for display
export const getFieldName = (fieldKey: string): string => {
  return fieldNames[fieldKey] || fieldKey;
}; 