import React, { useState, useEffect } from 'react';
import { getAllProductsForAdmin, createProduct, updateProduct, deleteProduct } from '../../../services/productService';
import { getAllBrandsForAdmin } from '../../../services/brandService';
import { getAllCategoriesForAdmin } from '../../../services/categoryService';
import type { Product } from '../../../types';
import type { Brand } from '../../../types';
import type { Category } from '../../../types';
import './Products.css';
import ProductFormModal from '../../../components/AdminProduct/ProductModal';

export interface ProductFormData {
  productId: number;
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


  const [formData, setFormData] = useState<ProductFormData>({
    productId: 0,
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

  // Add
  const handleAddProduct = () => {
    setFormData({
      productId: 0,
      productName: '',
      price: 0,
      slug: '',
      status: 'Available',
      quantity: 0,
      unitCost: 0,
      totalAmount: 0,
      brandId: brands.length > 0 ? brands[0].id : 0,
      imageUrl: ''
    });
    setShowAddModal(true);
  };

  // Edit
  const handleEditProduct = (product: Product) => {
    setFormData({
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      slug: product.slug,
      status: product.status,
      quantity: product.quantity,
      unitCost: product.unitCost ?? 0,
      totalAmount: product.totalAmount ?? 0,
      brandId: product.brandId ?? 0,
      imageUrl: product.imageUrl
    });
    setShowAddModal(true);
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
        <button className="add-product-btn" onClick={handleAddProduct}>
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
            className="filter-select text-dark"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="filter-select text-dark"
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
            className="filter-select text-dark"
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
              <td>{product.brand || 'N/A'}</td>
              <td><span
                className="badge px-2 py-1 text-white"
                style={{
                  backgroundColor:
                    product.status === 'Hot Deal'
                      ? '#e53935'
                      : product.status === 'Best Seller'
                        ? '#fb8c00'
                        : product.status === 'New Arrival'
                          ? '#43a047'
                          : '#6c757d',
                  fontSize: 12,
                  borderRadius: 4,
                  textTransform: 'uppercase'
                }}
              >
                {product.status}
              </span></td>
              <td><img src={`/img/${product.imageUrl}`} alt={product.productName} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} /></td>
              <td>
                <button onClick={() => handleEditProduct(product)}>Edit</button>

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
      <ProductFormModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchData}
        id={formData.productId}
        formData={formData}
        setFormData={setFormData}
        brands={brands}
      />
    </div>
  );
} 