import React, { useState } from 'react';
import type { Rating } from '../../types';
import Pagination from '../Pagination';

interface Props {
  ratings: Rating[];
  ratingScore: number;
}

const RATINGS_PER_PAGE = 5;

const ProductRatings: React.FC<Props> = ({ ratings, ratingScore }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ratings.length / RATINGS_PER_PAGE);
  const startIndex = (currentPage - 1) * RATINGS_PER_PAGE;
  const paginatedRatings = ratings.slice(startIndex, startIndex + RATINGS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-5">
      <h4 className="mb-3 text-start">Đánh Giá Sản Phẩm</h4>

      <div className="d-flex align-items-center mb-3">
        <div style={{ fontSize: '2.5rem', color: 'red', fontWeight: 'bold' }}>
          {ratingScore.toFixed(1)}
        </div>
        <div className="ms-3">
          <div className="text-warning">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(ratingScore) ? 'text-warning' : 'text-muted'}>
                ★
              </span>
            ))}
          </div>
          <div className="text-muted small">{ratings.length} đánh giá</div>
        </div>
      </div>

      <div className="border rounded p-3 text-start" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {ratings.length === 0 ? (
          <p>Chưa có đánh giá nào.</p>
        ) : (
          paginatedRatings.map((rating) => (
            <div key={rating.ratingId} className="border-bottom py-3">
              <div className="d-flex align-items-center mb-2">
                <div>
                  <div className="fw-semibold">{rating.customerName}</div>
                  <small className="text-muted">{new Date(rating.createdAt).toLocaleString()}</small>
                </div>
              </div>

              <div className="text-warning mb-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < rating.ratingScore ? 'text-warning' : 'text-muted'}>
                    ★
                  </span>
                ))}
              </div>

              <div className="mb-2">{rating.comment}</div>
            </div>
          ))
        )}
      </div>

      {ratings.length > RATINGS_PER_PAGE && (
        <div className="mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductRatings;
