import React from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  return (
    <div className="cart-page-container">
      <h2>Giỏ hàng của bạn</h2>
      {items.length === 0 ? (
        <div className="cart-empty">Chưa có sản phẩm nào trong giỏ hàng.</div>
      ) : (
        <>
          <div className="cart-list">
            {items.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-img" />
                <div className="cart-info">
                  <div className="cart-name">{item.name}</div>
                  <div className="cart-price">{item.price.toLocaleString()}đ</div>
                  <div className="cart-qty">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                      style={{ width: 40, textAlign: 'center' }}
                    />
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="cart-remove" onClick={() => removeFromCart(item.id)}>×</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">Tổng tiền: <b>{getTotal().toLocaleString()}đ</b></div>
            <button className="checkout-btn" onClick={() => { clearCart(); alert('Đặt hàng thành công!'); navigate('/'); }}>Thanh toán</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 