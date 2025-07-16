// ProductModal.tsx
import React, { useState, useEffect } from 'react';

import type { Brand } from '../../types';
import { createProduct, updateProduct } from '../../services/productService';
import type { ProductFormData } from '../../pages/Admin/Products';

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  id?: number;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  brands: Brand[];
}

export default function ProductFormModal({ show, onClose, onSuccess, formData, setFormData, brands }: Props) {
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    if (formData.imageUrl) {
      setPreviewImage(`/images/${formData.imageUrl}`);
    } else {
      setPreviewImage('');
    }
  }, [formData.imageUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'quantity', 'unitCost', 'totalAmount', 'brandId'].includes(name) ? parseFloat(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        imageUrl: formData.slug ? `${formData.slug}.jpg` : file.name
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.productName && formData.slug) {
        if (formData.imageUrl) {
          await updateProduct(formData.productId, formData);
        } else {
          await createProduct(formData);
        }
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!show) return null;

return (
  <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3">
    <div className="bg-white rounded-4 shadow-lg p-4" style={{ width: '420px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <h5 className="mb-0">{formData.productId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label">Tên sản phẩm</label>
          <input
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div>
          <label className="form-label">Giá (VND)</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            required
            min={0}
          />
        </div>

        <div>
          <label className="form-label">Thương hiệu</label>
          <select
            name="brandId"
            value={formData.brandId}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.brandName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Slug</label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="row">
          <div className="col-6">
            <label className="form-label">Số lượng</label>
            <input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="form-control"
              min={0}
            />
          </div>
          <div className="col-6">
            <label className="form-label">Đơn giá vốn</label>
            <input
              name="unitCost"
              type="number"
              value={formData.unitCost}
              onChange={handleChange}
              className="form-control"
              min={0}
            />
          </div>
        </div>

        <div>
          <label className="form-label">Tổng tiền</label>
          <input
            name="totalAmount"
            type="number"
            value={formData.totalAmount}
            onChange={handleChange}
            className="form-control"
            min={0}
          />
        </div>

        <div>
          <label className="form-label">Hình ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="img-thumbnail mt-2"
              style={{ maxHeight: '200px', objectFit: 'cover' }}
            />
          )}
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className="btn btn-primary">
            Lưu
          </button>
        </div>
      </form>
    </div>
  </div>
);

}
