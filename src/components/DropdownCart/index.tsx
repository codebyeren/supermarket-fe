import React, { useRef, useEffect } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import './DropdownCart.css';

const MAX_SHOW = 5;

const DropdownCart: React.FC<{ onClose: () => void; position: { top: number; left: number } }> = ({ onClose, position }) => {
  const { items } = useCartStore();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div
      className="dropdown-cart-popup"
      ref={ref}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 2000
      }}
    >
      <div className="dropdown-cart-header">Sản Phẩm Mới Thêm</div>
      <div className="dropdown-cart-list">
        {items.length === 0 ? (
          <div className="dropdown-cart-empty">
            <div style={{ fontSize: 38, color: '#eee', marginBottom: 8 }}>🛒</div>
            <div style={{ color: '#888', fontSize: 15 }}>Chưa có sản phẩm</div>
          </div>
        ) : (
          <>
            {items.slice(0, MAX_SHOW).map(item => (
              <div className="dropdown-cart-item" key={item.productId}>
                <img src={`/img/${item.imageUrl}`} alt={item.productName} className="dropdown-cart-img" />
                <div className="dropdown-cart-info">
                  <div className="dropdown-cart-name" title={item.productName}>{item.productName}</div>
                </div>
                <div className="dropdown-cart-price">{item.price.toLocaleString()}<span>đ</span></div>
              </div>
            ))}
            {items.length > MAX_SHOW && (
              <div className="dropdown-cart-more">{items.length - MAX_SHOW} Thêm Hàng Vào Giỏ</div>
            )}
          </>
        )}
      </div>
      <div className="dropdown-cart-footer">
        <button className="dropdown-cart-view-btn" onClick={() => { onClose(); navigate('/cart'); }}>Xem Giỏ Hàng</button>
      </div>
    </div>
  );
};

export default DropdownCart; 