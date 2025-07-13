import React, { useState } from 'react';
import './Promotions.css';

interface Promotion {
  id: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
  usageCount: number;
  maxUsage: number;
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 'PROMO001',
      name: 'Giảm giá mùa hè',
      description: 'Giảm giá 20% cho tất cả đồ uống',
      discountType: 'percentage',
      discountValue: 20,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      status: 'active',
      usageCount: 45,
      maxUsage: 100
    },
    {
      id: 'PROMO002',
      name: 'Khuyến mãi mới',
      description: 'Giảm 50,000đ cho đơn hàng từ 500,000đ',
      discountType: 'fixed',
      discountValue: 50000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      usageCount: 12,
      maxUsage: 50
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || promotion.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusToggle = (promotionId: string) => {
    setPromotions(prev => prev.map(promotion => 
      promotion.id === promotionId 
        ? { ...promotion, status: promotion.status === 'active' ? 'inactive' : 'active' }
        : promotion
    ));
  };

  const formatDiscount = (type: 'percentage' | 'fixed', value: number) => {
    if (type === 'percentage') {
      return `${value}%`;
    } else {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    }
  };

  const getStatusColor = (status: Promotion['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'expired': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: Promotion['status']) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'inactive': return 'Tạm dừng';
      case 'expired': return 'Hết hạn';
      default: return status;
    }
  };

  return (
    <div className="admin-promotions">
      <div className="promotions-header">
        <h1>Quản lý khuyến mãi</h1>
        <button className="add-promotion-btn">+ Thêm khuyến mãi</button>
      </div>

      <div className="promotions-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm khuyến mãi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select text-dark"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm dừng</option>
            <option value="expired">Hết hạn</option>
          </select>
        </div>
      </div>

      <div className="promotions-grid">
        {filteredPromotions.map(promotion => (
          <div key={promotion.id} className="promotion-card">
            <div className="promotion-header">
              <h3 className="promotion-name">{promotion.name}</h3>
              <span className={`status-badge ${getStatusColor(promotion.status)}`}>
                {getStatusText(promotion.status)}
              </span>
            </div>
            
            <p className="promotion-description">{promotion.description}</p>
            
            <div className="promotion-discount">
              <span className="discount-value">
                {formatDiscount(promotion.discountType, promotion.discountValue)}
              </span>
              <span className="discount-type">
                {promotion.discountType === 'percentage' ? 'Giảm %' : 'Giảm tiền'}
              </span>
            </div>
            
            <div className="promotion-dates">
              <div className="date-item">
                <span className="date-label">Từ:</span>
                <span className="date-value">{promotion.startDate}</span>
              </div>
              <div className="date-item">
                <span className="date-label">Đến:</span>
                <span className="date-value">{promotion.endDate}</span>
              </div>
            </div>
            
            <div className="promotion-usage">
              <div className="usage-info">
                <span className="usage-label">Sử dụng:</span>
                <span className="usage-value">{promotion.usageCount}/{promotion.maxUsage}</span>
              </div>
              <div className="usage-progress">
                <div 
                  className="usage-bar" 
                  style={{ width: `${(promotion.usageCount / promotion.maxUsage) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="promotion-actions">
              <button className="edit-btn">Sửa</button>
              <button 
                className={`toggle-status-btn ${promotion.status}`}
                onClick={() => handleStatusToggle(promotion.id)}
                disabled={promotion.status === 'expired'}
              >
                {promotion.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
              </button>
              <button className="delete-btn">Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="no-promotions">
          <p>Không tìm thấy khuyến mãi nào</p>
        </div>
      )}
    </div>
  );
} 