import React, { useState } from 'react';
import { postRating } from '../../services/productService';
import { useEffect } from 'react';

interface RatingModalProps {
  productId: number;
  onClose: () => void;
  onSuccess: () => void;
}
const RatingModal: React.FC<RatingModalProps> = ({ productId, onClose, onSuccess }) => {
  const [score, setScore] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

useEffect(() => {
  setScore(0);
  setComment('');
  setErrorMessage('');
  setShowNotification(false);
}, [productId]);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setErrorMessage('Bình luận không được để trống!');
      setShowNotification(true);
      return;
    }

    setLoading(true);
    try {
      const data = await postRating({ productId, ratingScore: score, comment });
      console.log('✅ Đánh giá gửi thành công:', data);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3">
      <div className="bg-white p-4 rounded shadow" style={{ width: '400px' }}>
        <h5 className="mb-3">Gửi đánh giá sản phẩm</h5>

     

        <div className="mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setScore(s)}
              style={{
                cursor: 'pointer',
                fontSize: '1.8rem',
                color: (hovered ?? score) >= s ? '#ffc107' : '#e4e5e9',
              }}
            >
              ★
            </span>
          ))}
        </div>

        <label className="form-label">Bình luận:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control mb-3"
          rows={3}
        />

        {showNotification && (
          <div className={`alert ${errorMessage ? 'alert-danger' : 'alert-success'} py-1`}>
            {errorMessage || 'Đánh giá đã được gửi thành công!'}
          </div>
        )}

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Hủy
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
