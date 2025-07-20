import React, { useState, useRef } from 'react';
import "../../styles/admin-common.css";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  initialData?: any;
  brands: Array<{ id: number; brandName: string }>;
  promotions: Array<{ promotionId: number; description: string }>;
  categories: Array<{ id: number; categoryName: string; children: any[] }>;
}

const defaultForm = {
  productName: '',
  price: '',
  slug: '',
  status: 'active',
  quantity: '',
  unitCost: '',
  brandId: '',
  imageUrl: '',
  promotionId: '',
  parentCategoryId: '',
  childCategoryId: '',
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({ open, onClose, onSuccess, initialData, brands, promotions, categories }) => {
  const [form, setForm] = useState<any>(initialData ? { ...initialData } : defaultForm);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [childCategories, setChildCategories] = useState<any[]>([]);

  // Khi chọn cha, cập nhật dropdown con
  React.useEffect(() => {
    if (form.parentCategoryId) {
      const found = categories.find(cat => String(cat.id) === String(form.parentCategoryId));
      setChildCategories(found?.children || []);
      setForm((prev: any) => ({ ...prev, childCategoryId: '' }));
    } else {
      setChildCategories([]);
      setForm((prev: any) => ({ ...prev, childCategoryId: '' }));
    }
  }, [form.parentCategoryId, categories]);

  React.useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setImagePreview(initialData.imageUrl || '');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      // Reset form khi không có initialData (add mode)
      setForm(defaultForm);
      setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev: any) => ({ ...prev, imageUrl: file.name }));
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview('');
    setForm((prev: any) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let categoryId: number[] = [];
    if (form.childCategoryId && form.parentCategoryId) categoryId = [Number(form.parentCategoryId), Number(form.childCategoryId)];
    else if (form.parentCategoryId) categoryId = [Number(form.parentCategoryId)];
    const requestBody: any = {
      productName: form.productName,
      price: Number(form.price),
      slug: form.slug,
      status: form.status,
      quantity: Number(form.quantity),
      unitCost: Number(form.unitCost),
      brandId: Number(form.brandId),
      imageUrl: form.imageUrl || '',
      promotionId: form.promotionId ? Number(form.promotionId) : undefined,
      categoryId: categoryId.length > 0 ? categoryId : undefined,
    };
    
    // Thêm productId nếu đang edit
    if (initialData && initialData.productId) {
      requestBody.productId = initialData.productId;
      console.log('✅ Edit mode - productId added:', initialData.productId);
    } else {
      console.log('❌ Edit mode but no productId found in initialData:', initialData);
    }
    
    console.log('📤 Request body before cleanup:', requestBody);
    Object.keys(requestBody).forEach(key => requestBody[key] === undefined && delete requestBody[key]);
    console.log('📤 Final request body:', requestBody);
    onSuccess(requestBody);
  };

  const handleReset = () => {
    setForm(defaultForm);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  React.useEffect(() => {
    if (!open) {
      // Reset form hoàn toàn khi modal đóng
      setForm(defaultForm);
      setImagePreview('');
      setChildCategories([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" style={{zIndex: 9999}}>
      <div
        style={{
          minWidth: '60vw',
          maxWidth: 800,
          margin: '40px auto',
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          position: 'relative',
          boxShadow: '0 2px 16px #eee',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <button
          className="close-modal-btn"
          onClick={onClose}
          aria-label="Đóng"
        >×</button>
        <h2 style={{marginBottom: 32, fontWeight: 700, fontSize: 28, textAlign: 'center'}}> {initialData ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} style={{display: 'flex', gap: 32, flexWrap: 'wrap'}}>
          <div style={{flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 20}}>
            {/* Các trường còn lại giữ nguyên */}
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Product Name:</label>
              <input
                name="productName"
                type="text"
                value={form.productName}
                onChange={handleChange}
                required
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
              />
            </div>
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Price:</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
              />
            </div>
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Slug:</label>
              <input
                name="slug"
                type="text"
                value={form.slug}
                onChange={handleChange}
                required
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
              />
            </div>
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Status:</label>
              <input
                name="status"
                type="text"
                value={form.status}
                onChange={handleChange}
                required
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
              />
            </div>
            {/* Category cha */}
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Parent Category:</label>
              <select
                name="parentCategoryId"
                value={form.parentCategoryId}
                onChange={handleChange}
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
              >
                <option value="">Select parent category</option>
                {categories.filter(cat => cat.children && cat.children.length > 0).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                ))}
              </select>
            </div>
            {/* Category con */}
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Child Category:</label>
              <select
                name="childCategoryId"
                value={form.childCategoryId}
                onChange={handleChange}
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
                disabled={childCategories.length === 0}
              >
                <option value="">Select child category</option>
                {childCategories.map(child => (
                  <option key={child.id} value={child.id}>{child.categoryName}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 20}}>
            {/* Promotion sang phải */}
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Promotion:</label>
              <select
                name="promotionId"
                value={form.promotionId}
                onChange={handleChange}
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
              >
                <option value="">No promotion</option>
                {promotions.map(promo => (
                  <option key={promo.promotionId} value={promo.promotionId}>{promo.description}</option>
                ))}
              </select>
            </div>
            {/* Brand màu chữ đen */}
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Brand:</label>
              <select
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
                required
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.brandName}</option>
                ))}
              </select>
            </div>
            {/* Các trường còn lại giữ nguyên */}
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Quantity:</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                required
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
              />
            </div>
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Unit Cost:</label>
              <input
                name="unitCost"
                type="number"
                value={form.unitCost}
                onChange={handleChange}
                required
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
              />
            </div>
          
            <div className="form-group">
              <label style={{fontWeight: 600, marginBottom: 8, fontSize: 18}}>Image:</label>
              <input
                name="imageUrl"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="admin-search-input"
                style={{fontSize: 18, padding: '14px 18px', color: '#222'}}
              />
              {imagePreview && (
                <div style={{marginTop: 12, textAlign: 'center'}}>
                  <img src={ `/img/${imagePreview}`} alt="Preview" style={{width: 120, height: 120, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 8px #ddd'}} />
                  <div style={{fontSize: 13, color: '#888', marginTop: 4}}>{form.imageUrl}</div>
                  <button type="button" className="admin-btn delete-btn" style={{marginTop: 8}} onClick={handleImageRemove}>Remove image</button>
                </div>
              )}
            </div>
          </div>
          <div style={{width: '100%', display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 36}}>
            <button type="submit" className="admin-btn edit-btn" style={{fontSize: 18, padding: '12px 32px'}}>{initialData ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-btn delete-btn" style={{fontSize: 18, padding: '12px 32px'}} onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal; 