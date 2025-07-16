import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory } from '../../services/categoryService';
import type { Category } from '../../types';


interface CategoryFormModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Category | null;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ show, onClose, onSuccess, initialData }) => {
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.categoryName);
      setSlug(initialData.slug);
    } else {
      setCategoryName('');
      setSlug('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
        await updateCategory(initialData.id, { categoryName, slug });
      } else {
        await createCategory({ categoryName, slug });
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
            <div className="bg-white p-4  shadow" style={{ width: '400px' }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{initialData ? 'Edit Category' : 'Add Category'}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : initialData ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CategoryFormModal;
