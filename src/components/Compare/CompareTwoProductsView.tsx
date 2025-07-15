import React from 'react';
import type { Product } from '../../types';

type CompareTwoProductsViewProps = {
  productA: Product;
  productB: Product;
  onClose: () => void;
};

const CompareTwoProductsView: React.FC<CompareTwoProductsViewProps> = ({
  productA,
  productB,
  onClose,
}) => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3"
      style={{ zIndex: 1060 }}
    >
      <div
        className="bg-white p-4 rounded shadow w-100"
        style={{
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Compare Products</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>Attribute</th>
              <th>{productA.productName}</th>
              <th>{productB.productName}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Image</td>
              <td>
                <img src={`/img/${productA.imageUrl}`} alt={productA.productName} width={80} />
              </td>
              <td>
                <img src={`/img/${productB.imageUrl}`} alt={productB.productName} width={80} />
              </td>
            </tr>
            <tr>
              <td>Price</td>
              <td>{productA.price.toLocaleString()} ₫</td>
              <td>{productB.price.toLocaleString()} ₫</td>
            </tr>
            <tr>
              <td>Brand</td>
              <td>{productA.brand}</td>
              <td>{productB.brand}</td>
            </tr>
            <tr>
              <td>Promotion</td>
              <td>
                {productA.discountPercent
                  ? `${productA.discountPercent}%`
                  : productA.discountAmount
                  ? `${productA.discountAmount.toLocaleString()} ₫`
                  : 'No promotion'}
              </td>
              <td>
                {productB.discountPercent
                  ? `${productB.discountPercent}%`
                  : productB.discountAmount
                  ? `${productB.discountAmount.toLocaleString()} ₫`
                  : 'No promotion'}
              </td>
            </tr>
            <tr>
              <td>Rating</td>
              <td>{productA.ratingScore.toFixed(1)} ★</td>
              <td>{productB.ratingScore.toFixed(1)} ★</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareTwoProductsView;
