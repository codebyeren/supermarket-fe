import React from 'react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

 const formatCurrency = (value: number, currency: string = 'USD') =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

const PromotionDescription: React.FC<Props> = ({ product }) => {
  const { promotionType, discountPercent, discountAmount, minOrderValue, minOrderQuantity } = product;

  if (!promotionType) return null;

  let description = '';

  switch (promotionType) {
    case 'PERCENT_DISCOUNT':
      if (discountPercent) description = `Giảm ${discountPercent}% cho sản phẩm này`;
      break;
    case 'ORDER_VALUE_DISCOUNT':
      if (minOrderValue && discountAmount)
        description = `Giảm ${formatCurrency(discountAmount)} cho đơn hàng từ ${formatCurrency(minOrderValue)}`;
      break;
    case 'BUY_ONE_GET_ONE':
      description = 'Mua 1 tặng 1 cùng sản phẩm';
      break;
    case 'ORDER_QUANTITY_GIFT':
    case 'GIFT_ITEM':
      if (minOrderQuantity) description = `Mua ${minOrderQuantity} tặng 1`;
      else description = 'Tặng kèm quà khi mua sản phẩm';
      break;
    default:
      return null;
  }

  return (
    <div className="alert alert-warning  border-4 shadow-sm p-3 mt-3 text-start" style={{ fontSize: '0.95rem' }}>
      <strong>🎉 Khuyến mãi:</strong> {description}
    </div>
  );
};

export default PromotionDescription;
