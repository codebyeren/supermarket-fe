import React from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrashAlt, FaCreditCard, FaGift } from 'react-icons/fa';
import type { CartItem } from '../../stores/cartStore';
import './Cart.css';
import { calculateDiscountedPrice, formatCurrency } from '../../utils/decimalUtils';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  function getDiscountedPrice(item: CartItem) {
    if (item.discountPercent) {
      return calculateDiscountedPrice(item.price, item.discountPercent, 2);
    }
    return item.price;
  }

  function getItemTotal(item: CartItem) {
    return getDiscountedPrice(item) * item.quantity;
  }

  function getTotalPrice() {
    const total = items.reduce((sum, item) => sum + getItemTotal(item), 0);
    return Math.round(total * 100) / 100;
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <h2>My Cart</h2>
      {items.length === 0 ? (
        <div className="empty-cart-message">
          <FaShoppingCart />
          <p>Your cart is currently empty.</p>
          <button className="continue-shopping" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div className="cart-item" key={item.productId}>
                <div className="item-image">
                  <img src={`/public/img/${item.imageUrl}`} alt={item.productName} />
                </div>
                <div className="item-details">
                  <h3>{item.productName}</h3>
                  <div className="cart-item-price">
                    {item.discountPercent ? (
                      <>
                        <span className="original-price">{formatCurrency(item.price, 'USD', 2)}</span>
                        <span className="discounted-price">
                          {formatCurrency(getDiscountedPrice(item), 'USD', 2)}
                          <span className="discount-badge">-{item.discountPercent}%</span>
                        </span>
                      </>
                    ) : (
                      <span className="price">{formatCurrency(item.price, 'USD', 2)}</span>
                    )}
                  </div>
                  <div className="item-info">
                    <div className="info-row">
                      <span className="label">Stock:</span>
                      <span className="value">{item.stock} items</span>
                    </div>
                    {item.promotionType && (
                      <div className="info-row">
                        <span className="label">Promotion:</span>
                        <span className="value">
                          <FaGift style={{ color: '#e53935', marginRight: 4 }} />
                          {item.promotionType}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}>
                      <span>-</span>
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, Math.min(item.quantity + 1, item.stock))} disabled={item.quantity >= item.stock}>
                      <span>+</span>
                    </button>
                  </div>
                  <div className="item-total">
                    <span>Total:</span>
                    <span className="total-price">{formatCurrency(getItemTotal(item), 'USD', 2)}</span>
                  </div>
                  <button className="remove-button" onClick={() => removeFromCart(item.productId)}>
                    <FaTrashAlt /> <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-row">
              <span>Total Products:</span>
              <span>{items.length}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span className="total-price">{formatCurrency(getTotalPrice(), 'USD', 2)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout} disabled={items.length === 0}>
              <FaCreditCard /> <span>Proceed to Checkout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
