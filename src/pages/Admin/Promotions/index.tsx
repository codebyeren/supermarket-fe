import React, { useEffect, useState } from 'react';
import './Promotions.css';
import { fetchPromotions } from '../../../services/promotionService';
import AdminPopup from '../../../components/AdminPopup/AdminPopup';
import axiosInstance from '../../../services/axiosInstance';
import '../../../styles/admin-common.css';

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

      <AdminPopup open={showDetail} onClose={() => setShowDetail(false)}>
        {detail && (
          <div style={{minWidth: 350}}>
            <h2>Chi tiết khuyến mãi</h2>
            <div><b>Mã:</b> {detail.promotionId}</div>
            <div><b>Loại:</b> {detail.promotionType}</div>
            <div><b>Mô tả:</b> {detail.description}</div>
            <div><b>Thời gian:</b> {detail.startDate.slice(0,10)} - {detail.endDate.slice(0,10)}</div>
            {detail.discountPercent && <div><b>Giảm %:</b> {detail.discountPercent}%</div>}
            {detail.discountAmount && <div><b>Giảm tiền:</b> {detail.discountAmount}</div>}
            {detail.giftProductName && <div><b>Sản phẩm tặng:</b> {detail.giftProductName}</div>}
            {detail.minOrderValue && <div><b>Đơn tối thiểu:</b> {detail.minOrderValue}</div>}
            {detail.minOrderQuantity && <div><b>Số lượng tối thiểu:</b> {detail.minOrderQuantity}</div>}
            <div><b>Trạng thái:</b> {detail.isActive ? 'Đang hoạt động' : 'Tạm dừng'}</div>
            <div style={{marginTop: 12}}>
              <b>Sản phẩm áp dụng:</b>
              {detail.products && detail.products.length > 0 ? (
                <ul style={{margin: 0, paddingLeft: 18}}>
                  {detail.products.map((p: any) => (
                    <li key={p.productId}>
                      <span>{p.productName}</span> - <span>{p.price} USD</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>Không có sản phẩm áp dụng</div>
              )}
            </div>
          </div>
        )}
      </AdminPopup>
    </div>
  );
} 