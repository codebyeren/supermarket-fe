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
    try {
      await deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (err) {
      setError('Cannot delete category');
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-categories">
      <div className="categories-header">
        <div>
          <h1>Category Management</h1>
          <p className="categories-subtitle">
            Showing category hierarchy with {filteredCategories.length} categories
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

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Slug</th>
            <th>Level</th>
            <th>Child Categories</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => {
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
                  <button className="admin-btn edit-btn" onClick={() => { setSelectedCategory(category); setShowFormModal(true); }}>Edit</button>
                  <button className="admin-btn delete-btn" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
      />
    </div>

  );
} 