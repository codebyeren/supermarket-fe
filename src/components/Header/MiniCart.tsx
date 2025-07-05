import React, { useRef, useEffect } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';

const MiniCart: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { items, getTotal } = useCartStore();
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

  return (
    <div className="mini-cart-popup" ref={ref}>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: '#222' }}>
        Có tổng số <span style={{ color: '#e53935', fontWeight: 700 }}>{totalCount}</span> sản phẩm
      </div>
      <div className="mini-cart-list">
        {items.length === 0 ? (
          <div className="mini-cart-empty">
            <div style={{ fontSize: 38, color: '#eee', marginBottom: 8 }}>🛒</div>
            <div style={{ color: '#888', fontSize: 15 }}>Chưa có sản phẩm</div>
          </div>
        ) : (
          items.slice(0, 4).map(item => (
            <div className="mini-cart-item" key={item.id}>
              <img src={item.image} alt={item.name} className="mini-cart-img" />
              <div className="mini-cart-info">
                <div className="mini-cart-name">{item.name}</div>
                <div className="mini-cart-qty">x{item.quantity}</div>
              </div>
              <div className="mini-cart-price">{item.price.toLocaleString()}<span style={{ color: '#e53935' }}>đ</span></div>
            </div>
          ))
        )}
      </div>
      {items.length > 4 && <div style={{ textAlign: 'center', color: '#888', fontSize: 13, margin: '4px 0 0 0' }}>+{items.length - 4} sản phẩm nữa...</div>}
      <div className="mini-cart-footer" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 8, marginTop: 10 }}>
        <div className="mini-cart-total" style={{ color: '#e53935', fontWeight: 700, fontSize: 16 }}>
          {getTotal().toLocaleString()}<span style={{ color: '#e53935' }}>đ</span>
        </div>
        <button className="mini-cart-view-btn" onClick={() => { onClose(); navigate('/cart'); }}>Xem chi tiết</button>
      </div>
    </div>
  );
};

export default MiniCart;