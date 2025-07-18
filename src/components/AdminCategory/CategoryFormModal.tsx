import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory } from '../../services/categoryService';
import type { Category } from '../../types';


interface CategoryFormModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Category | null;
  categories: Category[];
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ show, onClose, onSuccess, initialData, categories }) => {
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'parent' | 'child'>('parent');
  const [parentId, setParentId] = useState('');

  useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.categoryName);
      setSlug(initialData.slug);
      setType(initialData.parentId ? 'child' : 'parent');
      setParentId(initialData.parentId ? String(initialData.parentId) : '');
    } else {
      setCategoryName('');
      setSlug('');
      setType('parent');
      setParentId('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
        if (type === 'child') {
          await updateCategory(initialData.id, { categoryName, slug, parentId: Number(parentId) });
        } else {
          await updateCategory(initialData.id, { categoryName, slug });
        }
      } else {
        if (type === 'child') {
          await createCategory({ categoryName, slug, parentId: Number(parentId) });
        } else {
          await createCategory({ categoryName, slug });
        }
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
   <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3">
            <div style={{ background: '#e9eafc', borderRadius: 14, boxShadow: '0 4px 24px #b3b6e055', width: 420, padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header" style={{border: 'none', background: 'none', padding: 0, marginBottom: 18}}>
              <h5 className="modal-title" style={{color: '#4b5fa7', fontWeight: 700, fontSize: 22}}>{initialData ? 'Edit Category' : 'Add Category'}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body" style={{padding: 0}}>
              <div className="mb-3">
                <label className="form-label" style={{color: '#4b5fa7', fontWeight: 600}}>Type</label>
                <select className="form-control" style={{borderRadius: 8, border: '1.5px solid #b3b6e0', fontSize: 16, color: '#4b5fa7', padding: '10px 14px'}} value={type} onChange={e => setType(e.target.value as any)}>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                </select>
              </div>
              {type === 'child' && (
                <div className="mb-3">
                  <label className="form-label" style={{color: '#4b5fa7', fontWeight: 600}}>Parent Category</label>
                  <select className="form-control" style={{borderRadius: 8, border: '1.5px solid #b3b6e0', fontSize: 16, color: '#4b5fa7', padding: '10px 14px'}} value={parentId} onChange={e => setParentId(e.target.value)} required>
                    <option value="">Select parent category</option>
                    {categories.filter(cat => !cat.parentId).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label" style={{color: '#4b5fa7', fontWeight: 600}}>Category Name</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="form-control"
                  style={{borderRadius: 8, border: '1.5px solid #b3b6e0', fontSize: 16, color: '#4b5fa7', padding: '10px 14px'}}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{color: '#4b5fa7', fontWeight: 600}}>Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="form-control"
                  style={{borderRadius: 8, border: '1.5px solid #b3b6e0', fontSize: 16, color: '#4b5fa7', padding: '10px 14px'}}
                  required
                />
              </div>
            </div>
            <div className="modal-footer" style={{border: 'none', background: 'none', padding: 0, marginTop: 28, display: 'flex', gap: 16, justifyContent: 'flex-end'}}>
              <button type="button" className="btn" style={{background: '#ecebfa', color: '#4b5fa7', borderRadius: 8, fontWeight: 600, padding: '10px 24px', fontSize: 16, border: 'none'}} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn" style={{background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)', color: '#fff', borderRadius: 8, fontWeight: 700, padding: '10px 32px', fontSize: 16, border: 'none'}} disabled={loading}>
                {loading ? 'Saving...' : initialData ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CategoryFormModal;
