import React, { useState, useEffect } from 'react';
import { putRating } from '../../services/productService';

interface RatingModalEditProps {
  ratingId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const RatingEditModal: React.FC<RatingModalEditProps> = ({ ratingId, onClose, onSuccess }) => {
  const [score, setScore] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setScore(0);
    setComment('');
    setErrorMessage('');
    setShowNotification(false);
  }, [ratingId]);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setErrorMessage('Comment cannot be empty!');
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
      console.error('❌ Failed to submit rating:', err);

      try {
        const json = await err.json?.();
        setErrorMessage(json?.message || 'Failed to update rating');
      } catch {
        const fallbackText = await err.text?.();
        setErrorMessage(fallbackText || err.message || 'Unknown error');
      }

      setShowNotification(true);
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3">
      <div className="bg-white p-4 rounded shadow" style={{ width: '400px' }}>
        <h5 className="mb-3">Update Product Rating</h5>
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

        <label className="form-label">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control mb-3"
          rows={3}
        />

        {showNotification && (
          <div className={`alert ${errorMessage ? 'alert-danger' : 'alert-success'} py-1`}>
            {errorMessage || 'Rating updated successfully!'}
          </div>
        )}

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingEditModal;
