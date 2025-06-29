import React from 'react';
import type { Product } from '../../types/index';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PromotionBadge from '../Promotion/PromotionBadge';

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
    <div
      onClick={handleClick}
      role="button"
      className="card position-relative h-100 product-card shadow-sm "
      style={{ cursor: 'pointer', transition: 'transform 0.3s ease', minHeight: '380px' }}
    >
      {product.promotionType != null && (
        <PromotionBadge product={product} />
    )}



      {/* Icon yêu thích */}
      <span
        className="position-absolute top-0 end-0 m-2"
        role="button"
        onClick={(e) => e.stopPropagation()}
      >
        <FaHeart color={product.isFavorite ? 'red' : 'gray'} />
      </span>

      {/* Hình ảnh */}
      <img
        src={`/img/${product.imageUrl}`}
        className="card-img-top p-3"
        alt={product.productName}
        style={{
          objectFit: 'contain',
          height: '180px',
          transition: 'transform 0.3s ease',
        }}
      />

      {/* Nội dung */}
      <div className="card-body d-flex flex-column justify-content-between p-2">
        {/* Rating */}
        <div className="d-flex align-items-center mb-1" style={{ fontSize: '0.85rem' }}>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < Math.round(product.ratingScore) ? 'text-warning' : 'text-secondary'}
            />
          ))}
          <span className="ms-1 text-muted small">{product.ratingScore.toFixed(1)}</span>
        </div>

        {/* Tên sản phẩm */}
        <p
          className="card-text small fw-medium mb-2 text-truncate text-start"
          title={product.productName}
          style={{ fontSize: '0.9rem' }}
        >
          {product.productName}
        </p>


        <div className="d-flex justify-content-between align-items-center mt-auto">

          <div className="d-flex align-items-baseline gap-2">
            {/* Giá sau giảm */}
            <div className="fw-bold text-danger" style={{ fontSize: '1.1rem' }}>
              {formatCurrency(product.price * (1 - (product.discountPercent ?? 0) / 100))}
            </div>

            {/* Giá gốc nếu có giảm */}
            {hasDiscount && (
              <div
                className="text-muted text-decoration-line-through"
                style={{ fontSize: '0.9rem' }}
              >
                {formatCurrency(product.price)}
              </div>
            )}
          </div>


        </div>
      </div>
      <button
        className="btn btn-outline-success btn-sm"
        onClick={(e) => {
          e.stopPropagation();

        }}
      >
        <FaShoppingCart /> Thêm Giỏ Hàng
      </button>

      
    </div>
  );
};

export default ProductCard;
