import React, { useState } from 'react';
import { putRating } from '../../services/productService';

interface RatingModalEditProps {
  ratingId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const RatingEditModal: React.FC<RatingModalEditProps> = ({ ratingId, onClose, onSuccess }) => {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setErrorMessage('Bình luận không được để trống!');
      setShowNotification(true);
      return;
    }

    try {
      await putRating({ ratingScore: score, comment }, ratingId); 

      setErrorMessage('');
      setShowNotification(true);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('❌ Gửi đánh giá thất bại:', err);

      try {
        const json = await err.json?.();
        setErrorMessage(json?.message || 'Gửi đánh giá thất bại');
      } catch {
        const fallbackText = await err.text?.();
        setErrorMessage(fallbackText || err.message || 'Lỗi không xác định');
      }

      setShowNotification(true);
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3">
      <div className="bg-white p-4 rounded shadow" style={{ width: '400px' }}>
        <h5 className="mb-3">Cập nhật đánh giá sản phẩm</h5>

        <label className="form-label">Số sao:</label>
        <select
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="form-select mb-3"
        >
          {[5, 4, 3, 2, 1].map((s) => (
            <option key={s} value={s}>
              {s} sao
            </option>
          ))}
        </select>

        <label className="form-label">Bình luận:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control mb-3"
          rows={3}
        />

        {showNotification && (
          <div className={`alert ${errorMessage ? 'alert-danger' : 'alert-success'} py-1`}>
            {errorMessage || 'Đánh giá đã được cập nhật thành công!'}
          </div>
        )}

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Hủy
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingEditModal;
