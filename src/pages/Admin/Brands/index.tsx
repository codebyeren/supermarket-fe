import React, { useState, useEffect } from 'react';
import { getAllBrandsForAdmin, createBrand, updateBrand, deleteBrand } from '../../../services/brandService';
import type { Brand } from '../../../types';
import './Brands.css';

interface BrandFormData {
  brandName: string;
  slug: string;
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<BrandFormData>({
    brandName: '',
    slug: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const brandsData = await getAllBrandsForAdmin();
      setBrands(brandsData);
    } catch (err) {
      setError('Không thể tải dữ liệu thương hiệu');
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = async () => {
    try {
      const response = await createBrand(formData);
      if (response.code === 201) {
        await fetchBrands(); // Refresh data
        setShowAddModal(false);
        resetForm();
      }
    } catch (err) {
      setError('Không thể thêm thương hiệu');
      console.error('Error adding brand:', err);
    }
  };

  const handleUpdateBrand = async () => {
    if (!editingBrand) return;
    try {
      const response = await updateBrand(editingBrand.id, formData);
      if (response.code === 200) {
        await fetchBrands(); // Refresh data
        setEditingBrand(null);
        resetForm();
      }
    } catch (err) {
      setError('Không thể cập nhật thương hiệu');
      console.error('Error updating brand:', err);
    }
  };

  const handleDeleteBrand = async (brandId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) return;
    try {
      await deleteBrand(brandId);
      setBrands(prev => prev.filter(brand => brand.id !== brandId));
    } catch (err) {
      setError('Không thể xóa thương hiệu');
      console.error('Error deleting brand:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      brandName: '',
      slug: ''
    });
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      brandName: brand.brandName,
      slug: brand.slug
    });
  };

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-brands">
      <div className="brands-header">
        <h1>Quản lý thương hiệu</h1>
        <button className="add-brand-btn" onClick={() => setShowAddModal(true)}>
          + Thêm thương hiệu
        </button>
      </div>

      <div className="brands-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thương hiệu</th>
            <th>Slug</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredBrands.map(brand => (
            <tr key={brand.id}>
              <td>{brand.id}</td>
              <td>{brand.brandName}</td>
              <td>{brand.slug}</td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(brand)}>Sửa</button>
                <button className="delete-btn" onClick={() => handleDeleteBrand(brand.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredBrands.length === 0 && (
        <div className="no-brands">
          <p>Không tìm thấy thương hiệu nào</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingBrand) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              editingBrand ? handleUpdateBrand() : handleAddBrand();
            }}>
              <div className="form-group">
                <label>Tên thương hiệu:</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Slug:</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingBrand ? 'Cập nhật' : 'Thêm'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBrand(null);
                    resetForm();
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 