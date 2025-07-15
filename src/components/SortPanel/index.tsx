import React from 'react';
import type { SortState } from '../../utils/sortUtils';

interface SortPanelProps {
  sortState: SortState;
  onSortChange: (key: keyof SortState, value: 'asc' | 'desc' | undefined) => void;
  sortGroups: Array<{
    key: keyof SortState;
    label: string;
    options: Array<{ value: 'asc' | 'desc'; label: string; description: string }>;
  }>;
}

const SortPanel: React.FC<SortPanelProps> = ({ sortState, onSortChange, sortGroups }) => {
  return (
    <div style={{
      marginBottom: 24,
      padding: '20px',
      background: '#f8f9fa',
      borderRadius: 12,
      border: '1px solid #e9ecef',
      overflowX: 'auto'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: 16,
        fontWeight: 600,
        color: '#495057'
      }}>
        Sort by:
      </h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 18,
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%'
        }}
      >
        {sortGroups.map(group => (
          <div key={group.key} style={{ minWidth: 170, marginBottom: 0, flex: '1 1 170px', maxWidth: 220 }}>
            <div style={{ fontWeight: 600, color: '#2e7d32', marginBottom: 6 }}>{group.label}</div>
            <select
              value={sortState[group.key] || ''}
              onChange={e => onSortChange(group.key, e.target.value === '' ? undefined : (e.target.value as 'asc' | 'desc'))}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: '1.5px solid #bdbdbd',
                background: '#fff',
                color: '#222',
                fontWeight: 500,
                fontSize: 15,
                cursor: 'pointer',
                outline: 'none',
                minWidth: 120,
                marginBottom: 4,
                width: '100%'
              }}
            >
              <option value="">Default</option>
              {group.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div style={{ fontSize: 12, color: '#6c757d', fontStyle: 'italic', marginTop: 2 }}>
              {group.options.find(o => sortState[group.key] === o.value)?.description || 'Default'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortPanel;
