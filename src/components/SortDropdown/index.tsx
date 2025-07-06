import React from 'react';

export type SortOption = {
  value: string;
  label: string;
};

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (sortValue: string) => void;
  options: SortOption[];
}

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange, options }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 24,
      padding: '16px 20px',
      background: '#f8f9fa',
      borderRadius: 12,
      border: '1px solid #e9ecef'
    }}>
      <label style={{
        fontWeight: 600,
        color: '#495057',
        fontSize: 14,
        whiteSpace: 'nowrap'
      }}>
        Sắp xếp theo:
      </label>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid #ced4da',
          background: '#fff',
          fontSize: 14,
          color: '#495057',
          cursor: 'pointer',
          minWidth: 180,
          outline: 'none',
          transition: 'border-color 0.2s'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#2e7d32';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#ced4da';
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown; 