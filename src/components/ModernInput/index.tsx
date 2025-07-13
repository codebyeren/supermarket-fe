import React, { useState } from 'react';
import './ModernInput.css';

interface ModernInputProps {
  id?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'select';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  select?: boolean;
  options?: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal';
  min?: string;
  max?: string;
}

const ModernInput: React.FC<ModernInputProps> = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  select = false,
  options = [],
  children,
  inputMode,
  min,
  max
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputId = id || name;

  if (select) {
    return (
      <div className={`modern-input-group ${error ? 'has-error' : ''} ${isFocused ? 'focused' : ''}`}>
        <label htmlFor={inputId} className="modern-input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
        <div className="modern-select-wrapper">
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className="modern-input modern-select"
            required={required}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="modern-select-arrow">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        {error && <div className="modern-input-error">{error}</div>}
      </div>
    );
  }

  return (
    <div className={`modern-input-group ${error ? 'has-error' : ''} ${isFocused ? 'focused' : ''}`}>
      <label htmlFor={inputId} className="modern-input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="modern-input-wrapper">
        <input
          id={inputId}
          name={name}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="modern-input"
          inputMode={inputMode}
          min={min}
          max={max}
        />
        
        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="modern-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {showPassword ? (
                <>
                  <path d="M1 12S5 4 12 4S23 12 23 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 2L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              ) : (
                <>
                  <path d="M1 12S5 4 12 4S23 12 23 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              )}
            </svg>
          </button>
        )}
        
        {/* Custom children */}
        {children}
      </div>
      {error && <div className="modern-input-error">{error}</div>}
    </div>
  );
};

export default ModernInput; 