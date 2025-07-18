
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Promotions.css';
import { fetchPromotions, togglePromotionStatus } from '../../../services/promotionService';
import AdminPopup from '../../../components/AdminPopup/AdminPopup';
import axiosInstance from '../../../services/axiosInstance';
import '../../../styles/admin-common.css';
import PromotionFormModal from '../../../components/AdminPromotion/PromotionFormModal';
import type { Product } from '../../../types';
import PromotionDetailPopup from '../../../components/AdminPromotion/PromotionDetail';
import AttachPromotionProductModal from '../../../components/AdminPromotion/AttachPromotionProductModal';

export interface Promotion {
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
  products: Product[];
}

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAttachPopup, setShowAttachPopup] = useState(false);
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

  const getPromotionDetails = (promotion: Promotion) => {
    const isGift =
      promotion.promotionType === 'GIFT_ITEM' ||
      promotion.promotionType === 'ORDER_QUANTITY_GIFT'

    let title = '';
    let detail: React.ReactNode = null;

    switch (promotion.promotionType) {
      case 'PERCENT_DISCOUNT':
        if (promotion.discountPercent) {
          detail = `Discount ${promotion.discountPercent}% on the product`;
        }
        break;

      case 'ORDER_VALUE_DISCOUNT':
        if (promotion.discountAmount && promotion.minOrderValue) {
          title = 'Order Value Promotion';
          detail = (
            <>
              Save <b>{formatCurrency(promotion.discountAmount)}</b> for orders from{' '}
              <b>{formatCurrency(promotion.minOrderValue)}</b>
            </>
          );
        }
        break;

      case 'BUY_ONE_GET_ONE':
        title = 'Buy One Get One Free';
        detail = 'Buy One Get One Free'

        break;

      case 'ORDER_QUANTITY_GIFT':
      case 'GIFT_ITEM':
        title = 'Gift';
        detail = (
          <>
            Buy {promotion.minOrderQuantity || 1} get:{' '}
            <Link
              to={`/product/${promotion.giftProductSlug}`}
              className="text-decoration-underline fw-semibold"
            >
              {promotion.giftProductName}
            </Link>
          </>
        );
        break;

      default:
        return null;
    }

    return { isGift, title, detail };
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'warning';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };
  const handleTogglePromotionStatus = async (promotionId: number, isActive: boolean) => {
    try {
      await togglePromotionStatus(promotionId, !isActive);
      setPromotions((prev) =>
        prev.map((promotion) =>
          promotion.promotionId === promotionId
            ? { ...promotion, isActive: !isActive }
            : promotion
        )
      );
    } catch (error) {
      console.error('Error updating promotion status:', error);
    }
  };



  return (
    <div className="admin-promotions">
      <header
        style={{
          boxShadow: '0 2px 8px #e0f2f1',
          marginBottom: '2rem',
          background: 'linear-gradient(to bottom, rgba(74, 144, 226, 0.4), rgba(255, 255, 255, 0.7))',
          padding: '1rem',
          borderRadius: '0.5rem',
        }}
      >
        <div className="promotions-header">
          <h1>Promotions Management</h1>
          <button className="add-promotion-btn" onClick={() => setShowAddModal(true)}>
            + Add Promotion
          </button>
          <button className="add-promotion-btn" onClick={() => setShowAttachPopup(true)}>Promotion Manager</button>
        </div>
      </header>

      <div className="promotions-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search promotions..."
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
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {filteredPromotions.map(promotion => {
        const { isGift, title, detail } = getPromotionDetails(promotion) || {};
        if (!detail) return null;

        const giftProduct = promotion.products.find(p => p.productId === promotion.giftProductId);

        return (
          <div
            key={promotion.promotionId}
            className="promotion-card d-flex border rounded p-2 align-items-start gap-2 shadow-sm mt-3"
            style={{ backgroundColor: '#fff5f5' }}
          >

            <div style={{ flex: 1 }}>

              <div className="promotion-header">

                <h3 className="promotion-name" style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: 14 }}>
                  🎁 {title || promotion.description}{' '}
                  {promotion.description && (
                    <span className="text-muted" style={{ fontWeight: 'normal' }}>
                      [{promotion.description}]
                    </span>
                  )}
                </h3>
                <span className={`status-badge ${getStatusColor(promotion.isActive)}`}>
                  {getStatusText(promotion.isActive)}
                </span>
              </div>

              <div className="fw-semibold" style={{ fontSize: 14 }}>
                {detail}
              </div>

              {isGift && (


                <>
                  <img
                    src={`/img/${promotion.giftProductImg}`}
                    alt={promotion.giftProductName || 'Gift Product'}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 6,
                    }}
                  />
                  {giftProduct?.price && (
                    <div
                      style={{
                        fontSize: 13,
                        color: '#999',
                        textDecoration: 'line-through',
                      }}
                    >
                      {formatCurrency(giftProduct.price)}
                    </div>
                  )}
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

              {promotion.minOrderValue && (
                <div style={{ fontSize: 14 }}>
                  <strong>Min Order Value:</strong>{' '}
                  {formatCurrency(promotion.minOrderValue)}
                </div>
              )}

              {promotion.minOrderQuantity && (
                <div style={{ fontSize: 14 }}>
                  <strong>Min Order Quantity:</strong> {promotion.minOrderQuantity}
                </div>
              )}

              <div className="promotion-dates mt-2">
                <div className="date-item">
                  <span className="date-label">From:</span>
                  <span className="date-value">{promotion.startDate.slice(0, 10)}</span>
                </div>
                <div className="date-item">
                  <span className="date-label">To:</span>
                  <span className="date-value">{promotion.endDate.slice(0, 10)}</span>
                </div>
              </div>

              <div className="promotion-actions mt-2">
                <button className="admin-btn edit-btn">Edit</button>
                <button
                  className={`toggle-status-btn ${promotion.isActive ? 'active' : 'inactive'}`}
                  onClick={() => handleTogglePromotionStatus(promotion.promotionId, promotion.isActive)}
                >
                  {promotion.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  className="admin-btn detail-btn"
                  onClick={() => {
                    setSelectedPromotionId(promotion.promotionId);
                    setShowDetail(true);
                  }}

                  disabled={loadingDetail}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {filteredPromotions.length === 0 && (
        <div className="no-promotions">
          <p>No promotions found</p>
        </div>
      )}
      <AttachPromotionProductModal
        visible={showAttachPopup}
        onClose={() => setShowAttachPopup(false)}
      />
      <PromotionDetailPopup
        visible={showDetail}
        onClose={() => setShowDetail(false)}
        promotionId={selectedPromotionId}
      />

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
