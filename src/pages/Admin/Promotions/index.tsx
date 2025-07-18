import React, { useEffect, useState } from 'react';
import './Promotions.css';
import { fetchPromotions } from '../../../services/promotionService';
import AdminPopup from '../../../components/AdminPopup/AdminPopup';
import axiosInstance from '../../../services/axiosInstance';
import '../../../styles/admin-common.css';
import PromotionFormModal from '../../../components/AdminPromotion/PromotionFormModal';

interface Promotion {
  promotionId: number;
  promotionType: string;
  description: string;
  startDate: string;
  endDate: string;
  discountPercent: number | null;
  discountAmount: number | null;
  giftProductId: number | null;
  giftProductName: string | null;
  giftProductImg: string | null;
  giftProductSlug: string | null;
  minOrderValue: number | null;
  minOrderQuantity: number | null;
  isActive: boolean;
  products: any[];
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [detail, setDetail] = useState<Promotion | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchPromotions().then(setPromotions);
  }, []);

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && promotion.isActive) ||
      (filterStatus === 'inactive' && !promotion.isActive);
    return matchesSearch && matchesStatus;
  });

  const formatDiscount = (promotion: Promotion) => {
    if (promotion.promotionType === 'PERCENT_DISCOUNT' && promotion.discountPercent) {
      return `${promotion.discountPercent}%`;
    }
    if (promotion.promotionType === 'ORDER_VALUE_DISCOUNT' && promotion.discountAmount) {
      return `-${promotion.discountAmount} USD`;
    }
    if (promotion.promotionType === 'BUY_ONE_GET_ONE' && promotion.giftProductName) {
      return `Mua 1 tặng 1: ${promotion.giftProductName}`;
    }
    if (promotion.promotionType === 'GIFT_ITEM' && promotion.giftProductName) {
      return `Tặng: ${promotion.giftProductName}`;
    }
    if (promotion.promotionType === 'ORDER_QUANTITY_GIFT' && promotion.giftProductName) {
      return `Tặng: ${promotion.giftProductName}`;
    }
    return '';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'warning';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Đang hoạt động' : 'Tạm dừng';
  };

  const handleShowDetail = async (promotionId: number) => {
    setLoadingDetail(true);
    try {
      const res = await axiosInstance.get(`/promotions/${promotionId}`);
      setDetail(res.data.data);
      setShowDetail(true);
    } catch (e) {
      alert('Không lấy được chi tiết khuyến mãi!');
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="admin-promotions">
      <div className="promotions-header">
        <h1>Quản lý khuyến mãi</h1><button className="add-promotion-btn" onClick={() => setShowAddModal(true)}>
          + Thêm khuyến mãi
        </button>

      </div>

      <div className="promotions-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm khuyến mãi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
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
          </select>
        </div>
      </div>

      {filteredPromotions.map(promotion => (
        <div key={promotion.promotionId} className="promotion-card">
          <div className="promotion-header">
            <h3 className="promotion-name">{promotion.description}</h3>
            <span className={`status-badge ${getStatusColor(promotion.isActive)}`}>
              {getStatusText(promotion.isActive)}
            </span>
          </div>

          <p className="promotion-description">{formatDiscount(promotion)}</p>

          <div className="promotion-dates">
            <div className="date-item">
              <span className="date-label">Từ:</span>
              <span className="date-value">{promotion.startDate.slice(0, 10)}</span>
            </div>
            <div className="date-item">
              <span className="date-label">Đến:</span>
              <span className="date-value">{promotion.endDate.slice(0, 10)}</span>
            </div>
          </div>

          <div className="promotion-actions">
            <button className="admin-btn edit-btn">Sửa</button>
            <button className={`toggle-status-btn ${promotion.isActive ? 'active' : 'inactive'}`}>{promotion.isActive ? 'Tạm dừng' : 'Kích hoạt'}</button>
            <button className="admin-btn delete-btn">Xóa</button>
            <button className="admin-btn detail-btn" onClick={() => handleShowDetail(promotion.promotionId)} disabled={loadingDetail}>Xem chi tiết</button>
          </div>
        </div>
      ))}

      {filteredPromotions.length === 0 && (
        <div className="no-promotions">
          <p>Không tìm thấy khuyến mãi nào</p>
        </div>
      )}

      {showAddModal && (
        <PromotionFormModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchPromotions().then(setPromotions);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
} 