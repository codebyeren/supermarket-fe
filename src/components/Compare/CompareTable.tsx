import React from 'react';
import type { Product } from '../../types';
import { Link } from 'react-router-dom';

type ComparePopupProps = {
  show: boolean;
  onClose: () => void;
  products: Product[];
  onCompare: (product: Product) => void; // ✅ Callback khi chọn sản phẩm để so sánh
};

const ComparePopup: React.FC<ComparePopupProps> = ({ show, onClose, products, onCompare }) => {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3"
      style={{ zIndex: 1055 }}
    >
      <div
        className="bg-white p-4 rounded shadow"
        style={{
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '80vh',
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
          <h5 className="mb-0">So sánh sản phẩm cùng danh mục</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>

        {/* Danh sách sản phẩm */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {products.length ? (
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Thương hiệu</th>
                    <th>Khuyến mãi</th>
                    <th>Đánh giá</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.productId}>
                      <td className="d-flex align-items-center gap-2 text-start">
                        <Link to={`/product/${item.slug}`} onClick={onClose}>
                          <img
                            src={`/img/${item.imageUrl}`}
                            alt={item.productName}
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                          />
                        </Link>
                        <span>{item.productName}</span>
                      </td>
                      <td>{item.price.toLocaleString()} ₫</td>
                      <td>{item.brand}</td>
                      <td>
                        {item.discountPercent
                          ? `${item.discountPercent}%`
                          : item.discountAmount
                          ? `${item.discountAmount.toLocaleString()} ₫`
                          : 'Không có'}
                      </td>
                      <td>{item.ratingScore} ★</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => onCompare(item)}
                        >
                          So sánh
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-muted text-center py-4">Không có sản phẩm để so sánh.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparePopup;
