import React from 'react';
import type { Product } from '../../types'; 

interface PromotionBadgeProps {
  product: Product;
}

 const formatCurrency = (value: number, currency: string = 'USD') =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

const PromotionBadge: React.FC<PromotionBadgeProps> = ({ product }) => {
  const {
    promotionType,
    discountPercent,
    discountAmount,
    minOrderValue,
    minOrderQuantity,
  } = product;

  if (!promotionType) return null;

  switch (promotionType) {
    case 'PERCENT_DISCOUNT':
      return discountPercent ? (
        <span className="badge bg-danger position-absolute top-0 start-0 m-2">
          -{discountPercent}% GIẢM
        </span>
      ) : null;

    case 'BUY_ONE_GET_ONE':
      return (
        <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
          Mua 1 Tặng 1
        </span>
      );

    case 'GIFT_ITEM':
      return (
        <span className="badge bg-success position-absolute top-0 start-0 m-2">
          🎁 {minOrderQuantity ? `Mua ${minOrderQuantity} tặng 1` : 'Tặng quà'}
        </span>
      );

    case 'ORDER_VALUE_DISCOUNT':
      return minOrderValue && discountAmount ? (
        <span className="badge bg-info text-dark position-absolute top-0 start-0 m-2">
          Đơn  {formatCurrency(minOrderValue)} giảm {formatCurrency(discountAmount)}
        </span>
      ) : null;

    case 'ORDER_QUANTITY_GIFT':
      return minOrderQuantity ? (
        <span className="badge bg-primary position-absolute top-0 start-0 m-2">
          🎁 Mua {minOrderQuantity} tặng 1
        </span>
      ) : null;

    default:
      return null;
  }
};

export default PromotionBadge;
