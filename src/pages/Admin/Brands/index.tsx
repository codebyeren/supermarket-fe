import React, { useState, useEffect } from 'react';
import { getAllBrandsForAdmin, createBrand, updateBrand, deleteBrand } from '../../../services/brandService';
import type { Brand } from '../../../types';
import './Brands.css';
import AddBrandModal from '../../../components/AdminBrand/addBrand';
import BrandFormModal from '../../../components/AdminBrand/brandModal';
import '../../../styles/admin-common.css';

interface BrandFormData {
  brandName: string;
  slug: string;
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

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

  const openAddBrand = () => {
    setSelectedBrand(null);
    setShowFormModal(true);
  };

  const openEditBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowFormModal(true);
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
        <button className="add-brand-btn" onClick={() => openAddBrand()}>
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
            className="admin-search-input"
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
                <button className="admin-btn edit-btn" onClick={() => openEditBrand(brand)}>Edit</button>
                <button className="admin-btn delete-btn" onClick={() => handleDeleteBrand(brand.id)}>Delete</button>
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
      <BrandFormModal
        show={showFormModal}
        initialData={selectedBrand}
        onClose={() => setShowFormModal(false)}
        onSuccess={() => {
          fetchBrands();
          setShowFormModal(false);
        }}
      />
    </div>
  );
}
