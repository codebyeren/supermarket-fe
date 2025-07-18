import React from 'react';
import type { ReactNode } from 'react';

interface AdminPopupProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const AdminPopup: React.FC<AdminPopupProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <>
      <div className="custom-detail-popup-bg" onClick={onClose} />
      <div className="custom-detail-popup">
        {children}
        <div className="modal-actions" style={{marginTop: 16}}>
          <button className="cancel-btn" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </>
  );
};

export default AdminPopup; 