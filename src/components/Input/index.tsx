import React, { useId } from 'react';
import styles from '../../pages/Register/RegisterForm.module.css';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date';
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  children?: React.ReactNode;
  inputMode?: 'text' | 'email' | 'tel' | 'search' | 'url' | 'none' | 'numeric' | 'decimal';
  select?: boolean;
  options?: { value: string; label: string }[];
  min?: string;
  max?: string;
  step?: string;
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
  inputMode,
  select = false,
  options = [],
  min,
  max,
  step,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`form-group ${className}`}>
      {select ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`form-control${name === 'country' ? ' ' + styles.selectCountry : ''}${error ? ' is-invalid' : ''}`}
        >
          <option value="">Chọn...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder=" "
          required={required}
          disabled={disabled}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          inputMode={inputMode}
          min={min}
          max={max}
          step={step}
        />
      )}
      <label htmlFor={inputId}>{label}</label>
      {children}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Input; 