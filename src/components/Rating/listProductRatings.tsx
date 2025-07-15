import React, { useState, useMemo } from 'react';
import type { Rating } from '../../types';

interface Props {
  ratings: Rating[];
  ratingScore: number;
  onWriteRating?: () => void;
}

const ProductRatings: React.FC<Props> = ({ ratings, ratingScore, onWriteRating }) => {
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredRatings = useMemo(() => {
    let result = filterStar
      ? ratings.filter((r) => r.ratingScore === filterStar)
      : [...ratings];

    result.sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return result;
  }, [ratings, filterStar, sortOrder]);

  const countByStars = (star: number) =>
    ratings.filter((r) => r.ratingScore === star).length;

  return (
    <div className="mt-5">
      <h4 className="fw-bold mb-3 text-start">Reviews & Ratings</h4>

      {/* Average rating and write button */}
      <div className="d-flex align-items-center mb-4">
        <div style={{ fontSize: '2.5rem', color: 'red', fontWeight: 'bold' }}>
          {ratingScore.toFixed(1)}/5
        </div>
        <div className="ms-3">
          <div className="text-warning">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(ratingScore) ? 'text-warning' : 'text-muted'}>
                ★
              </span>
            ))}
          </div>
          <div className="text-muted small">{ratings.length} ratings</div>
        </div>
        {onWriteRating && (
          <div className="ms-auto">
            <button className="btn btn-primary btn-sm" onClick={onWriteRating}>
              Write a review
            </button>
          </div>
        )}
      </div>

      {/* Filter + sort */}
      <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
        <button
          className={`btn btn-sm ${filterStar === null ? 'btn-danger' : 'btn-outline-secondary'}`}
          onClick={() => setFilterStar(null)}
        >
          All
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            className={`btn btn-sm ${filterStar === star ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setFilterStar(star)}
          >
            {star} ★ ({countByStars(star)})
          </button>
        ))}

        {/* Sort options */}
        <div className="ms-auto">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="form-select form-select-sm"
            style={{ width: 160 }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="border rounded p-3 bg-light">
        {filteredRatings.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <>
            {filteredRatings.slice(0, visibleCount).map((rating) => (
              <div key={rating.ratingId} className="bg-white p-3 rounded shadow-sm mb-3">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{rating.customerName}</strong>
                    <div className="text-warning small text-start">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < rating.ratingScore ? 'text-warning' : 'text-muted'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-muted small">
                      {new Date(rating.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-start">{rating.comment}</div>
              </div>
            ))}

            {visibleCount < filteredRatings.length && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductRatings;
