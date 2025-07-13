import React, { useState, useEffect } from 'react';
import { getAllProductsForAdmin, createProduct, updateProduct, deleteProduct } from '../../../services/productService';
import { getAllBrandsForAdmin } from '../../../services/brandService';
import { getAllCategoriesForAdmin } from '../../../services/categoryService';
import type { Product } from '../../../types';
import type { Brand } from '../../../types';
import type { Category } from '../../../types';
import './Products.css';

interface ProductFormData {
  productName: string;
  price: number;
  slug: string;
  status: string;
  quantity: number;
  unitCost: number;
  totalAmount: number;
  brandId: number;
  imageUrl: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    price: 0,
    slug: '',
    status: 'Available',
    quantity: 0,
    unitCost: 0,
    totalAmount: 0,
    brandId: 0,
    imageUrl: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Available' | 'Unavailable'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, brandsData, categoriesData] = await Promise.all([
        getAllProductsForAdmin(),
        getAllBrandsForAdmin(),
        getAllCategoriesForAdmin()
      ]);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Không thể tải dữ liệu');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = await createProduct(formData);
      setProducts(prev => [...prev, newProduct]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError('Không thể thêm sản phẩm');
      console.error('Error adding product:', err);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      const updatedProduct = await updateProduct(editingProduct.productId, formData);
      setProducts(prev => prev.map(p => p.productId === editingProduct.productId ? updatedProduct : p));
      setEditingProduct(null);
      resetForm();
    } catch (err) {
      setError('Không thể cập nhật sản phẩm');
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.productId !== productId));
    } catch (err) {
      setError('Không thể xóa sản phẩm');
      console.error('Error deleting product:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      price: 0,
      slug: '',
      status: 'Available',
      quantity: 0,
      unitCost: 0,
      totalAmount: 0,
      brandId: 0,
      imageUrl: ''
    });
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      price: product.price,
      slug: product.slug,
      status: product.status,
      quantity: product.quantity,
      unitCost: product.unitCost || 0,
      totalAmount: product.totalAmount || 0,
      brandId: product.brandId || 0,
      imageUrl: product.imageUrl
    });
  };

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || 
      categories.find(cat => cat.id === product.brandId)?.categoryName === filterCategory;
    const matchesBrand = filterBrand === 'all' || 
      brands.find(brand => brand.id === product.brandId)?.brandName === filterBrand;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  }) : [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Quản lý sản phẩm</h1>
        <button className="add-product-btn" onClick={() => setShowAddModal(true)}>
          + Thêm sản phẩm
        </button>
      </div>

      <div className="products-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category.id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
          
          <select 
            value={filterBrand} 
            onChange={(e) => setFilterBrand(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.brandName}>
                {brand.brandName}
              </option>
            ))}
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Available">Có sẵn</option>
            <option value="Unavailable">Không có sẵn</option>
          </select>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thương hiệu</th>
            <th>Trạng thái</th>
            <th>Hình ảnh</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.productName}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.quantity}</td>
              <td>{brands.find(b => b.id === product.brandId)?.brandName || 'N/A'}</td>
              <td>{product.status === 'Available' ? 'Có sẵn' : 'Không có sẵn'}</td>
              <td><img src={product.imageUrl} alt={product.productName} style={{width: 48, height: 48, objectFit: 'cover', borderRadius: 4}} /></td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(product)}>Sửa</button>
                <button className="delete-btn" onClick={() => handleDeleteProduct(product.productId)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingProduct) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              editingProduct ? handleUpdateProduct() : handleAddProduct();
            }}>
              <div className="form-group">
                <label>Tên sản phẩm:</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Giá:</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
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
              
              <div className="form-group">
                <label>Số lượng:</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Giá vốn:</label>
                <input
                  type="number"
                  value={formData.unitCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitCost: Number(e.target.value) }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Tổng tiền:</label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Thương hiệu:</label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData(prev => ({ ...prev, brandId: Number(e.target.value) }))}
                  required
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.brandName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>URL hình ảnh:</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Trạng thái:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  required
                >
                  <option value="Available">Có sẵn</option>
                  <option value="Unavailable">Không có sẵn</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingProduct ? 'Cập nhật' : 'Thêm'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
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