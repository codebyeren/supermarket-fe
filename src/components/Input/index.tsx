import React, { useId } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date';
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  children?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  value,
  onChange,
  name,
  id,
  required = false,
  disabled = false,
  className = '',
  error,
  children,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`form-group ${className}`}>
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" " // Required for the :placeholder-shown selector
        required={required}
        disabled={disabled}
        className={`form-control ${error ? 'is-invalid' : ''}`}
      />
      <label htmlFor={inputId}>{label}</label>
      {children}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Input; 