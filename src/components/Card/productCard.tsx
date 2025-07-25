import React, { useState } from 'react';
import type { Product } from '../../types/index';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PromotionBadge from '../Promotion/PromotionBadge';
import { useAuthStore } from '../../stores/authStore';
import { deleteFavorite, toggleFavorite } from '../../services/favoriteService';
import { useCartStore } from '../../stores/cartStore';
import './productCard.css';

interface Props {
  product: Product;
  onAddToCartSuccess?: () => void;
  onAddToCartFail?: () => void;
  hideAddToCartButton?: boolean;
}

const ProductCard = ({ product, onAddToCartSuccess, onAddToCartFail, hideAddToCartButton }: Props) => {
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);
  const { isAuthenticated } = useAuthStore();
  const addToCart = useCartStore(state => state.addToCart);
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return;

    try {
      if (isFavorite) {
        await deleteFavorite(product.productId);
        setIsFavorite(false);
      } else {
        await toggleFavorite(product.productId);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Toggle favorite failed', err);
    }
  };

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
      className="card position-relative h-100 product-card shadow-sm"
      style={{ cursor: 'pointer', transition: 'transform 0.3s ease', minHeight: '380px' }}
    >
      {product.promotionType != null && (
        <PromotionBadge product={product} />
      )}

      {isAuthenticated && !hideAddToCartButton && (
        <span
          className="position-absolute top-0 end-0 m-2"
          role="button"
          onClick={handleToggleFavorite}
        >
          <FaHeart color={isFavorite ? 'red' : 'gray'} />
        </span>
      )}

      <img
        src={`/img/${product.imageUrl}`}
        className="card-img-top p-3 img-fluid d-block"
        alt={product.productName}
        style={{
          objectFit: 'contain',
          height: '180px',
          transition: 'transform 0.3s ease',
        }}
      />

      <div className="card-body d-flex flex-column justify-content-between p-2">
        <div className="rating-container">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < Math.round(product.ratingScore) ? 'text-warning' : 'text-secondary'}
            />
          ))}
          <span className="rating-score text-muted small">
            {product.ratingScore.toFixed(1)}
          </span>
        </div>

        <p
          className="card-text small fw-medium mb-2 text-start truncate-2"
          title={product.productName}
          style={{
            fontSize: '0.9rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.productName}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="d-flex align-items-baseline gap-2">
            <div className="fw-bold text-danger" style={{ fontSize: '1.1rem' }}>
              {formatCurrency(product.price * (1 - (product.discountPercent ?? 0) / 100))}
            </div>

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

      {!hideAddToCartButton && (
        <button
          style={{
            backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: '#fff',
            border: 'none',
          }}
          className="btn btn-outline-success btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            try {
              addToCart({
                productId: product.productId,
                productName: product.productName,
                price: product.price,
                slug: product.slug,
                status: product.status,
                brand: product.brand,
                imageUrl: product.imageUrl,
                stock: product.quantity,
                quantity: 1,
                promotionType: product.promotionType,
                discountPercent: product.discountPercent,
                discountAmount: product.discountAmount,
                giftProductId: product.giftProductId,
                minOrderValue: product.minOrderValue,
                minOrderQuantity: product.minOrderQuantity,
         
              });
              onAddToCartSuccess?.();
            } catch (error) {
              onAddToCartFail?.();
            }
          }}
        >
          <FaShoppingCart /> Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
