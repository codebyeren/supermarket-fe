import React, { useState, useEffect } from 'react';
import { getAllCategoriesForAdmin, createCategory, updateCategory, deleteCategory } from '../../../services/categoryService';
import type { Category } from '../../../types';
import './Categories.css';
import '../../../styles/admin-common.css';
import CategoryFormModal from '../../../components/AdminCategory/CategoryFormModal';

interface CategoryFormData {
  categoryName: string;
  slug: string;
}

interface CategoryWithLevel extends Category {
  level: number;
}


function flattenCategoriesTree(apiCategories: any[], level: number = 0): CategoryWithLevel[] {
  const result: CategoryWithLevel[] = [];
  
  function traverse(node: any, currentLevel: number) {
    const { id, categoryName, slug, parentId } = node.categoryDto;
    result.push({
      id,
      categoryName,
      slug,
      parentId,
      children: node.children ? node.children.map((child: any) => ({
        id: child.categoryDto.id,
        categoryName: child.categoryDto.categoryName,
        slug: child.categoryDto.slug,
        parentId: child.categoryDto.parentId,
        children: []
      })) : [],
      level: currentLevel
    });
    
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => traverse(child, currentLevel + 1));
    }
  }
  
  apiCategories.forEach(node => traverse(node, level));
  return result;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryWithLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithLevel | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: '',
    slug: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [openIds, setOpenIds] = useState<number[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllCategoriesForAdmin();
      setCategories(Array.isArray(categoriesData) ? flattenCategoriesTree(categoriesData) : []);
    } catch (err) {
      setError('Cannot load category data');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    // Kiểm tra nếu là cha và còn con thì không cho xóa
    const category = categories.find(cat => cat.id === categoryId);
    if (category && category.children && category.children.length > 0) {
      window.alert('Cannot delete parent category when it has children!');
      return;
    }
    try {
      await deleteCategory(categoryId);
      window.alert('Delete category successfully!');
      await fetchCategories(); // reload lại danh sách
    } catch (err) {
      setError('Cannot delete category');
      window.alert('Delete category failed!');
      console.error('Error deleting category:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryName: '',
      slug: ''
    });
  };



  const filteredCategories = categories.filter(category => {
    const name = category?.categoryName || '';
    const slug = category?.slug || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Hàm tạo indentation cho hiển thị tree
  const getIndentation = (level: number) => {
    return '　'.repeat(level * 2); // Sử dụng full-width space để tạo indentation
  };

  // Hàm tạo prefix cho hiển thị tree
  const getTreePrefix = (level: number, hasChildren: boolean, isLast: boolean = false) => {
    if (level === 0) return '';
    const indent = '　'.repeat((level - 1) * 2);
    if (isLast) {
      return indent + '└─ ';
    }
    return indent + (hasChildren ? '├─ ' : '└─ ');
  };

  // Tính toán filteredParents, filteredOpenIds cho search
  const lowerSearch = searchTerm.trim().toLowerCase();
  let filteredParents = categories.filter(cat => !cat.parentId);
  let filteredOpenIds: number[] = [];
  if (lowerSearch) {
    filteredParents = filteredParents.filter(parent => {
      const parentMatch = parent.categoryName.toLowerCase().includes(lowerSearch) || parent.slug.toLowerCase().includes(lowerSearch);
      const childMatch = (parent.children || []).some(child =>
        child.categoryName.toLowerCase().includes(lowerSearch) || child.slug.toLowerCase().includes(lowerSearch)
      );
      if (childMatch) filteredOpenIds.push(parent.id);
      return parentMatch || childMatch;
    });
  }
  useEffect(() => {
    if (lowerSearch) setOpenIds(filteredOpenIds);
    else setOpenIds([]);
  }, [searchTerm]);

  // Tree view UI với search
  const renderCategoryTree = () => {
    return (
      <div style={{margin: '24px 0'}}>
        {filteredParents.map(parent => (
          <div key={parent.id} style={{
            marginBottom: 12,
            background: '#e9eafc',
            borderRadius: 12,
            padding: '12px 20px',
            boxShadow: '0 2px 8px #f3f3fa',
            color: '#4b5fa7',
            transition: 'background 0.2s',
            position: 'relative',
          }}
            onMouseOver={e => e.currentTarget.style.background = '#d6d6f7'}
            onMouseOut={e => e.currentTarget.style.background = '#e9eafc'}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <button
                style={{
                  border: 'none', background: 'none', fontSize: 22, cursor: 'pointer',
                  marginRight: 4, color: '#4b5fa7', fontWeight: 700, display: 'flex', alignItems: 'center'
                }}
                onClick={() => setOpenIds(ids => ids.includes(parent.id) ? ids.filter(id => id !== parent.id) : [...ids, parent.id])}
                aria-label={openIds.includes(parent.id) ? 'Collapse' : 'Expand'}
              >
                <svg style={{transform: openIds.includes(parent.id) ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}} width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 5L13 10L7 15" stroke="#4b5fa7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span style={{fontWeight: 700, fontSize: 17, flex: 3, display: 'flex', gap: 12}}>
                <span style={{background: '#f7f8fc', borderRadius: 6, padding: '4px 80px ', fontWeight: 700, color: '#4b5fa7'}}>{parent.categoryName}</span>
                <span style={{background: '#ecebfa', borderRadius: 6, padding: '4px 80px ', fontWeight: 500, fontSize: 15, color: '#7f53ac'}}>{parent.slug}</span>
              </span>
              <div style={{display: 'flex', gap: 6, flex: 1, justifyContent: 'flex-end'}}>
                <button className="admin-btn edit-btn" style={{padding: '6px 14px', minWidth: 60, fontSize: 14, marginLeft: 0, background: '#e9eafc', color: '#4b5fa7', fontWeight: 700, border: '1.5px solid #b3b6e0', borderRadius: 7}} onClick={() => { const p = categories.find(cat => cat.id === parent.id); console.log('Edit parent:', p); if (p) setSelectedCategory(p); setShowFormModal(true); }}>Edit</button>
                <button className="admin-btn delete-btn" style={{padding: '6px 14px', minWidth: 60, fontSize: 14, marginLeft: 0, background: '#e9eafc', color: '#fc5c7d', fontWeight: 700, border: '1.5px solid #f7b6c7', borderRadius: 7}} onClick={() => handleDeleteCategory(parent.id)}>Delete</button>
              </div>
            </div>
            {openIds.includes(parent.id) && parent.children && parent.children.length > 0 && (
              <div style={{marginLeft: 32, marginTop: 8, borderLeft: '3px solid #d6d6f7', paddingLeft: 16}}>
                {parent.children.filter(child => {
                  if (!lowerSearch) return true;
                  return child.categoryName.toLowerCase().includes(lowerSearch) || child.slug.toLowerCase().includes(lowerSearch);
                }).map(child => (
                  <div key={child.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
                    background: '#f7f8fc', borderRadius: 7, padding: '8px 14px',
                    color: '#4b5fa7', fontWeight: 600, boxShadow: '0 1px 4px #f3e6fa',
                    transition: 'background 0.2s',
                  }}
                    onMouseOver={e => e.currentTarget.style.background = '#ecebfa'}
                    onMouseOut={e => e.currentTarget.style.background = '#f7f8fc'}
                  >
                    <span style={{display: 'flex', gap: 12, flex: 3}}>
                      <span style={{background: '#ecebfa', borderRadius: 6, padding: '4px  80px', fontWeight: 600, color: '#4b5fa7'}}>{child.categoryName}</span>
                      <span style={{background: '#e1e5e9', borderRadius: 6, padding: '4px  80px', fontWeight: 500, fontSize: 14, color: '#7f53ac'}}>{child.slug}</span>
                    </span>
                    <div style={{display: 'flex', gap: 6, flex: 1, justifyContent: 'flex-end'}}>
                      <button className="admin-btn edit-btn" style={{padding: '6px 14px', minWidth: 60, fontSize: 14, marginLeft: 0, background: '#ecebfa', color: '#4b5fa7', fontWeight: 700, border: '1.5px solid #b3b6e0', borderRadius: 7}} onClick={() => { const c = categories.find(cat => cat.id === child.id); console.log('Edit child:', c); if (c) setSelectedCategory(c); setShowFormModal(true); }}>Edit</button>
                      <button className="admin-btn delete-btn" style={{padding: '6px 14px', minWidth: 60, fontSize: 14, marginLeft: 0, background: '#ecebfa', color: '#fc5c7d', fontWeight: 700, border: '1.5px solid #f7b6c7', borderRadius: 7}} onClick={() => handleDeleteCategory(child.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    window.alert(error);
  }

  return (
    <div className="admin-categories">
      <div className="categories-header">
        <div>
          <h1>Category Management</h1>
          <p className="categories-subtitle">
            Showing category hierarchy with {categories.length} categories
          </p>
        </div>
        <button className="admin-btn add-category-btn" onClick={() => { setSelectedCategory(null); setShowFormModal(true); }}>+ Add Category</button>
      </div>

      <div className="categories-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
      </div>

      {renderCategoryTree()}

      {filteredCategories.length === 0 && (
        <div className="no-categories">
          <p>No categories found</p>
        </div>
      )}

        <CategoryFormModal
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSuccess={() => fetchCategories()}
        initialData={selectedCategory}
        categories={categories}
      />
    </div>

  );
} 