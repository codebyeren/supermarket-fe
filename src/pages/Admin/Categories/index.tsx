import React, { useState, useEffect } from 'react';
import { getAllCategoriesForAdmin, createCategory, updateCategory, deleteCategory } from '../../../services/categoryService';
import type { Category } from '../../../types';
import './Categories.css';

interface CategoryFormData {
  categoryName: string;
  slug: string;
}

interface CategoryWithLevel extends Category {
  level: number;
}

// Hàm chuyển đổi dữ liệu category API sang mảng phẳng với level để hiển thị tree
function flattenCategoriesTree(apiCategories: any[], level: number = 0): CategoryWithLevel[] {
  const result: CategoryWithLevel[] = [];
  
  function traverse(node: any, currentLevel: number) {
    const { id, categoryName, slug } = node.categoryDto;
    result.push({
      id,
      categoryName,
      slug,
      children: node.children ? node.children.map((child: any) => ({
        id: child.categoryDto.id,
        categoryName: child.categoryDto.categoryName,
        slug: child.categoryDto.slug,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithLevel | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: '',
    slug: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllCategoriesForAdmin();
      setCategories(Array.isArray(categoriesData) ? flattenCategoriesTree(categoriesData) : []);
    } catch (err) {
      setError('Không thể tải dữ liệu danh mục');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await createCategory(formData);
      if (response.code === 201) {
        await fetchCategories(); 
        setShowAddModal(false);
        resetForm();
      }
    } catch (err) {
      setError('Không thể thêm danh mục');
      console.error('Error adding category:', err);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    try {
      const response = await updateCategory(editingCategory.id, formData);
      if (response.code === 200) {
        await fetchCategories(); // Refresh data
        setEditingCategory(null);
        resetForm();
      }
    } catch (err) {
      setError('Không thể cập nhật danh mục');
      console.error('Error updating category:', err);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    try {
      await deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (err) {
      setError('Không thể xóa danh mục');
      console.error('Error deleting category:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryName: '',
      slug: ''
    });
  };

  const openEditModal = (category: CategoryWithLevel) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      slug: category.slug
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

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-categories">
      <div className="categories-header">
        <div>
          <h1>Quản lý danh mục</h1>
          <p className="categories-subtitle">
            Hiển thị cấu trúc phân cấp danh mục với {filteredCategories.length} danh mục
          </p>
        </div>
        <button className="add-category-btn" onClick={() => setShowAddModal(true)}>
          + Thêm danh mục
        </button>
      </div>

      <div className="categories-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
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
            <th>Tên danh mục</th>
            <th>Slug</th>
            <th>Cấp độ</th>
            <th>Số danh mục con</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => {
            // Kiểm tra xem có phải item cuối cùng trong cùng level không
            const isLastInLevel = index === filteredCategories.length - 1 || 
              filteredCategories[index + 1]?.level < category.level;
            
            return (
              <tr key={category.id} className={`category-level-${category.level}`}>
                <td>{category.id}</td>
                <td className="category-name-cell">
                  <span className="category-tree-display">
                    {getTreePrefix(category.level, (category.children?.length || 0) > 0, isLastInLevel)}
                    {category.categoryName}
                  </span>
                </td>
                <td>{category.slug}</td>
                <td>{category.level + 1}</td>
                <td>{category.children?.length || 0}</td>
                <td>
                  <button className="edit-btn" onClick={() => openEditModal(category)}>Sửa</button>
                  <button className="delete-btn" onClick={() => handleDeleteCategory(category.id)}>Xóa</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filteredCategories.length === 0 && (
        <div className="no-categories">
          <p>Không tìm thấy danh mục nào</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingCategory) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              editingCategory ? handleUpdateCategory() : handleAddCategory();
            }}>
              <div className="form-group">
                <label>Tên danh mục:</label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryName: e.target.value }))}
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
                  {editingCategory ? 'Cập nhật' : 'Thêm'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
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