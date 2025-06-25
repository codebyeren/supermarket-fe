import React from 'react';
import type { Product } from '../../types/index';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
 const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.slug}`);
  };
const formatCurrency = (value: number, currency: string = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);


  return (
    <div  onClick={handleClick} role="button" className="card position-relative shadow-sm h-100" style={{ width: '13rem' }}>
      {/* Giảm giá */}
      {hasDiscount && (
        <span className="badge bg-danger position-absolute top-0 start-0 m-2">
          -{product.discountPercent}%
        </span>
      )}

      {/* Icon yêu thích */}
      <span className="position-absolute top-0 end-0 m-2" role="button">
        <FaHeart color={product.isFavorite ? 'red' : 'gray'} />
      </span>

      {/* Hình ảnh */}
      <img
        src={product.imageUrl}
        className="card-img-top p-3"
        alt={product.productName}
        style={{ objectFit: 'contain', height: '150px' }}
      />

      {/* Nội dung */}
      <div className="card-body d-flex flex-column justify-content-between p-2" style={{ minHeight: '8rem' }}>
        {/* Rating */}
        <div className="d-flex align-items-center mb-2" style={{ fontSize: '0.85rem' }}>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < Math.round(product.ratingScore) ? 'text-warning' : 'text-secondary'}
            />
          ))}
          <span className="ms-1 text-muted small">{product.ratingScore.toFixed(1)}</span>
        </div>

        {/* Tên sản phẩm */}
        <p className="card-text truncate-2 small mb-2" title={product.productName}>
          {product.productName}
        </p>

        {/* Giá & giỏ hàng */}
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-success btn-sm">
            <FaShoppingCart />
          </button>
          <div className="text-end">
            <div className="fw-bold text-danger">
              {formatCurrency(product.price - (product.discountAmount ?? 0))}
            </div>
            {hasDiscount && (
              <small className="text-muted text-decoration-line-through">
                {formatCurrency(product.price)}
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
