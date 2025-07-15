import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const formatCurrency = (value: number, currency: string = 'VND') =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const PromotionDisplay: React.FC<Props> = ({ product }) => {
  const {
    promotionType,
    discountPercent,
    discountAmount,
    minOrderValue,
    minOrderQuantity,
    giftProductName,
    giftProductImg,
    giftProductSlug,
    promotionDescription,
    giftProductPrice,
  } = product;

  if (!promotionType) return null;

  const isGift =
    promotionType === 'GIFT_ITEM' ||
    promotionType === 'ORDER_QUANTITY_GIFT' ||
    promotionType === 'BUY_ONE_GET_ONE';

  let title = '';
  let detail: React.ReactNode = null;

  switch (promotionType) {
    case 'PERCENT_DISCOUNT':
      if (discountPercent) {
        detail = `Discount ${discountPercent}% on the product`;
      }
      break;

    case 'ORDER_VALUE_DISCOUNT':
      if (discountAmount && minOrderValue) {
        title = 'Order Value Promotion';
        detail = (
          <>
            Save <b>{formatCurrency(discountAmount)}</b> for orders from{' '}
            <b>{formatCurrency(minOrderValue)}</b>
          </>
        );
      }
      break;

    case 'BUY_ONE_GET_ONE':
      title = 'Buy One Get One Free';
      detail = giftProductName && giftProductSlug ? (
        <>Buy 1 get 1:&nbsp;</>
      ) : (
        'Buy 1 get 1 same product'
      );
      break;

    case 'ORDER_QUANTITY_GIFT':
    case 'GIFT_ITEM':
      title = 'Gift';
      detail = (
        <>
          Buy {minOrderQuantity || 1} get:&nbsp;
          <Link
            to={`/product/${giftProductSlug}`}
            className="text-decoration-underline fw-semibold"
          >
            {giftProductName}
          </Link>
        </>
      );
      break;

    default:
      return null;
  }

  return (
    <div
      className="d-flex border rounded p-2 align-items-start gap-2 shadow-sm mt-3"
      style={{ backgroundColor: '#fff5f5' }}
    >
      {isGift && giftProductImg && (
        <img
          src={`/img/${giftProductImg}`}
          alt={giftProductName}
          style={{
            width: 60,
            height: 60,
            objectFit: 'cover',
            borderRadius: 6,
          }}
        />
      )}

      <div style={{ flex: 1 }}>
        <div
          style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: 14 }}
        >
          🎁 {title}{' '}
          {promotionDescription && (
            <span
              className="text-muted"
              style={{ fontWeight: 'normal' }}
            >
              [{promotionDescription}]
            </span>
          )}
        </div>
        <div className="fw-semibold" style={{ fontSize: 14 }}>
          {detail}
        </div>
        {isGift && (
          <>
            <div
              style={{
                fontSize: 13,
                color: '#999',
                textDecoration: 'line-through',
              }}
            >
              {giftProductPrice}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#00c853',
              }}
            >
              Free
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PromotionDisplay;
