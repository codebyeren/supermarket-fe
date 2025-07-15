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
      setError('Unable to load brand data');
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = async () => {
    try {
      const response = await createBrand(formData);
      if (response.code === 201) {
        await fetchBrands();
        setShowAddModal(false);
        resetForm();
      }
    } catch (err) {
      setError('Unable to add brand');
      console.error('Error adding brand:', err);
    }
  };

  const handleUpdateBrand = async () => {
    if (!editingBrand) return;
    try {
      const response = await updateBrand(editingBrand.id, formData);
      if (response.code === 200) {
        await fetchBrands();
        setEditingBrand(null);
        resetForm();
      }
    } catch (err) {
      setError('Unable to update brand');
      console.error('Error updating brand:', err);
    }
  };

  const handleDeleteBrand = async (brandId: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    try {
      await deleteBrand(brandId);
      setBrands(prev => prev.filter(brand => brand.id !== brandId));
    } catch (err) {
      setError('Unable to delete brand');
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
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-brands">
      <div className="brands-header">
        <h1>Brand Management</h1>
        <button className="add-brand-btn" onClick={() => setShowAddModal(true)}>
          + Add Brand
        </button>
      </div>

      <div className="brands-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search brands..."
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
            <th>Brand Name</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBrands.map(brand => (
            <tr key={brand.id}>
              <td>{brand.id}</td>
              <td>{brand.brandName}</td>
              <td>{brand.slug}</td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(brand)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteBrand(brand.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredBrands.length === 0 && (
        <div className="no-brands">
          <p>No brands found</p>
        </div>
      )}

      {(showAddModal || editingBrand) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              editingBrand ? handleUpdateBrand() : handleAddBrand();
            }}>
              <div className="form-group">
                <label>Brand Name:</label>
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
                  {editingBrand ? 'Update' : 'Add'}
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
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
