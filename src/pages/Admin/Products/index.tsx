import React, { useState, useEffect } from 'react';
import { getAllProductsForAdmin, createProduct, updateProduct, deleteProduct, getProductBySlug } from '../../../services/productService';
import { getAllBrandsForAdmin } from '../../../services/brandService';
import { getAllCategoriesForAdmin } from '../../../services/categoryService';
import { fetchPromotions as fetchPromotionsApi } from '../../../services/promotionService';
import type { Product } from '../../../types';
import type { Brand } from '../../../types';
import type { Category } from '../../../types';
import './Products.css';
import '../../../styles/admin-common.css';
import AdminPopup from '../../../components/AdminPopup';
import ProductFormModal from '../../../components/AdminProduct/ProductFormModal';

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

// Hàm chuyển đổi dữ liệu category từ API về type Category FE
function mapApiCategory(apiCat: any, parentId: number | null = null): Category {
  const thisId = apiCat.categoryDto.id;
  return {
    id: thisId,
    categoryName: apiCat.categoryDto.categoryName,
    slug: apiCat.categoryDto.slug,
    parentId: parentId,
    children: (apiCat.children || []).map((child: any) => mapApiCategory(child, thisId))
  };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [selectedParent, setSelectedParent] = useState('all');
  const [selectedChild, setSelectedChild] = useState('all');
  const [promotions, setPromotions] = useState<any[]>([]);

  // useEffect fetch data ban đầu (brands, categories)
  useEffect(() => {
    fetchBrandsAndCategories();
    fetchPromotions();
  }, []);

  // useEffect fetch products khi filter thay đổi
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedParent, selectedChild, filterBrand]);

  // useEffect cập nhật childCategories khi chọn cha
  useEffect(() => {
    if (selectedParent === 'all') {
      setChildCategories([]);
      setSelectedChild('all');
    } else {
      const found = categories.find(item => String(item.id) === selectedParent);
      setChildCategories(found?.children || []);
      setSelectedChild('all');
    }
  }, [selectedParent, categories]);

  const fetchBrandsAndCategories = async () => {
    try {
      setLoading(true);
      const [brandsData, categoriesData] = await Promise.all([
        getAllBrandsForAdmin(),
        getAllCategoriesForAdmin()
      ]);
      setBrands(brandsData);
      setCategories(Array.isArray(categoriesData) ? categoriesData.map(cat => mapApiCategory(cat, null)) : []);
    } catch (err) {
      setError('Cannot load brands/categories');
      console.error('Error fetching brands/categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let categorySlug = '';
      if (selectedChild !== 'all') {
        const foundParent = categories.find(cat => String(cat.id) === selectedParent);
        const foundChild = foundParent?.children.find(child => String(child.id) === selectedChild);
        categorySlug = foundChild?.slug || '';
      } else if (selectedParent !== 'all') {
        const foundParent = categories.find(cat => String(cat.id) === selectedParent);
        categorySlug = foundParent?.slug || '';
      }
      let brandSlug = '';
      if (filterBrand !== 'all') {
        const foundBrand = brands.find(brand => String(brand.id) === filterBrand);
        brandSlug = foundBrand?.slug || '';
      }
      const filters = {
        searchName: searchTerm,
        category: categorySlug,
        brand: brandSlug
      };
      const productsData = await getAllProductsForAdmin(filters);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      setError('Cannot load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const data = await fetchPromotionsApi();
      setPromotions(Array.isArray(data) ? data : []);
    } catch (err) {
      setPromotions([]);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.productId !== productId));
    } catch (err) {
      setError('Cannot delete product');
      console.error('Error deleting product:', err);
    }
  };

  const handleShowDetail = async (slug: string) => {
    setShowDetailModal(true);
    setLoadingDetail(true);
    setDetailError(null);
    try {
      const detail = await getProductBySlug(slug);
      setDetailProduct(detail.productDto);
    } catch (e) {
      setDetailProduct(null);
      setDetailError('Cannot load product detail');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      const detail = await getProductBySlug(product.slug);
      const p = detail.productDto;
      // Map lại initialData cho form
      let parentCategoryId = '';
      let childCategoryId = '';
      // Tìm parent/child category từ categories
      if (p.categoryId) {
        const foundParent = categories.find(cat =>
          cat.children && cat.children.some(child => child.id === p.categoryId)
        );
        if (foundParent) {
          parentCategoryId = String(foundParent.id);
          childCategoryId = String(p.categoryId);
        } else {
          // Nếu là cha
          parentCategoryId = String(p.categoryId);
        }
      }
      console.log('Edit initialData', {
        ...p,
        brandId: p.brandId !== undefined ? String(p.brandId) : '',
        promotionId: p.promotionId !== undefined ? String(p.promotionId) : '',
        parentCategoryId,
        childCategoryId,
        status: p.status === 'active' || p.status === 'inactive' ? p.status : (p.status === 'Available' ? 'active' : 'inactive'),
      });
      setEditingProduct({
        ...p,
        brandId: p.brandId !== undefined ? String(p.brandId) : '',
        promotionId: p.promotionId !== undefined ? String(p.promotionId) : '',
        parentCategoryId,
        childCategoryId,
        status: p.status === 'active' || p.status === 'inactive' ? p.status : (p.status === 'Available' ? 'active' : 'inactive'),
      });
      setShowProductForm(true);
    } catch (e) {
   
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleProductFormSuccess = async (formData: any) => {
    try {
      if (editingProduct) {
      await updateProduct(formData.productId, formData);
      } else {
        await createProduct(formData);
      }
      await fetchProducts();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err) {
      setError('Cannot save product');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
  }

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Product Management</h1>
        <button className="add-product-btn" onClick={handleAddProduct}>
          + Add Product
        </button>
      </div>

      <div className="products-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div className="filter-controls">
          {/* Dropdown cha */}
          <select
            value={selectedParent}
            onChange={e => setSelectedParent(e.target.value)}
            className="filter-select text-dark"
          >
            <option value="all">All Parent Categories</option>
            {categories.filter(cat => !cat.parentId && cat.children && cat.children.length > 0).map(parent => (
              <option key={parent.id} value={String(parent.id)}>
                {parent.categoryName}
              </option>
            ))}
          </select>
          {/* Dropdown con */}
          <select
            value={selectedChild}
            onChange={e => setSelectedChild(e.target.value)}
            className="filter-select text-dark"
            disabled={childCategories.length === 0}
          >
            <option value="all">All Subcategories</option>
            {childCategories.map(child => (
              <option key={child.id} value={String(child.id)}>
                {child.categoryName}
              </option>
            ))}
          </select>
          {/* Dropdown brand giữ nguyên */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="filter-select text-dark"
          >
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={String(brand.id)}>
                {brand.brandName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Promotion Name</th>
            <th>Promotion Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.productName}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.quantity}</td>
              <td>{product.promotionType || 'None'}</td>
              <td>{product.promotionDescription || 'None'}</td>
              <td><img src={`/img/${product.imageUrl}`} alt={product.productName} style={{width: 48, height: 48, objectFit: 'cover', borderRadius: 4}} /></td>
              <td>
                <button className="admin-btn edit-btn" onClick={() => handleEditProduct(product)}>Edit</button>
                <button className="admin-btn delete-btn" onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
                <button className="admin-btn detail-btn" onClick={() => handleShowDetail(product.slug)}>Detail</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="no-products">
          <p>No products found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <ProductFormModal
        open={showProductForm}
        onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
        onSuccess={handleProductFormSuccess}
        initialData={editingProduct}
        brands={brands}
        promotions={promotions}
        categories={categories}
      />

      {showDetailModal && (
        <AdminPopup open={showDetailModal} onClose={() => { setShowDetailModal(false); setDetailProduct(null); }}>
          <button
            className="close-modal-btn"
            onClick={() => { setShowDetailModal(false); setDetailProduct(null); }}
            aria-label="Close"
          >×</button>
          <h2 style={{marginBottom: 32, fontWeight: 700, fontSize: 28, textAlign: 'center'}}>Product Detail</h2>
          {loadingDetail && <div>Loading...</div>}
          {detailError && <div style={{color: 'red'}}>{detailError}</div>}
          {detailProduct && !loadingDetail && !detailError && (
            <div style={{display: 'flex', gap: 32, flexWrap: 'wrap'}}>
              <div style={{flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 20}}>
                <div><b>Product Name:</b> {detailProduct.productName}</div>
                <div><b>Price:</b> {formatPrice(detailProduct.price ?? 0)}</div>
                <div><b>Slug:</b> {detailProduct.slug}</div>
                <div><b>Status:</b> {detailProduct.status}</div>
                <div><b>Quantity:</b> {detailProduct.quantity}</div>
                <div><b>Unit Cost:</b> {formatPrice(detailProduct.unitCost ?? 0)}</div>
                <div><b>Total Amount:</b> {formatPrice(detailProduct.totalAmount ?? 0)}</div>
                <div><b>Brand:</b> {detailProduct.brand || '-'}</div>
                <div><b>Category:</b> {detailProduct.categoryId || '-'}</div>
                <div><b>Promotion:</b> {detailProduct.promotionType || '-'}</div>
              </div>
              <div style={{flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 20}}>
                <div><b>Rating Score:</b> {detailProduct.ratingScore}</div>
                <div><b>Favorite:</b> {detailProduct.isFavorite ? 'Yes' : 'No'}</div>
                <div><b>Promotion Description:</b> {detailProduct.promotionDescription || '-'}</div>
                <div><b>Discount Percent:</b> {detailProduct.discountPercent ? detailProduct.discountPercent + '%' : '-'}</div>
                <div><b>Discount Amount:</b> {formatPrice(detailProduct.discountAmount ?? 0)}</div>
                <div><b>Min Order Value:</b> {formatPrice(detailProduct.minOrderValue ?? 0)}</div>
                <div><b>Min Order Quantity:</b> {detailProduct.minOrderQuantity ?? '-'}</div>
                <div><b>Promotion Start Date:</b> {detailProduct.startDate ? new Date(detailProduct.startDate).toLocaleDateString('en-US') : 'None'}</div>
                <div><b>Promotion End Date:</b> {detailProduct.endDate ? new Date(detailProduct.endDate).toLocaleDateString('en-US') : 'None'}</div>
                <div><b>Product Image:</b><br/>
                  <div style={{display: 'flex', justifyContent: 'center', margin: '16px 0'}}>
                    <img src={`/img/${detailProduct.imageUrl}`} alt={detailProduct.productName} style={{width: 180, height: 180, objectFit: 'cover', borderRadius: 12, background: '#fff', boxShadow: '0 2px 8px #ddd'}} />
                  </div>
                </div>
                {detailProduct.giftProductName && (
                  <div><b>Gift:</b> {detailProduct.giftProductName}
                    {detailProduct.giftProductImg && <div><img src={detailProduct.giftProductImg} alt={detailProduct.giftProductName} style={{width: 100, height: 100, objectFit: 'cover', borderRadius: 10, marginTop: 6}} /></div>}
                    {detailProduct.giftProductPrice && <div>Gift Price: {formatPrice(detailProduct.giftProductPrice ?? 0)}</div>}
                    {detailProduct.giftProductSlug && <div>Slug: {detailProduct.giftProductSlug}</div>}
                  </div>
                )}
              </div>
            </div>
          )}
          {!detailProduct && !loadingDetail && !detailError && (
            <div>No product data</div>
          )}
        </AdminPopup>
      )}
    </div>
  );
} 