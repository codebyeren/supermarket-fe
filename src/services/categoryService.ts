import axios from "axios";
import type { Category } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

function mapCategoryApiToFE(apiCat: any): Category {
  const { id, categoryName, slug } = apiCat.categoryDto;
  return {
    id,
    categoryName,
    slug,
    children: Array.isArray(apiCat.children)
      ? apiCat.children.map(mapCategoryApiToFE)
      : []
  };
}

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get(`${API_URL}/categories`);
  const apiData = res.data.data;
  return Array.isArray(apiData) ? apiData.map(mapCategoryApiToFE) : [];
};

// Admin APIs
export const createCategory = async (categoryData: {
  categoryName: string;
  slug: string;
}): Promise<{ code: number; message: string; data: { id: number; categoryName: string; slug: string } }> => {
  const response = await axios.post(`${API_URL}/categories`, categoryData);
  return response.data;
};

export const updateCategory = async (categoryId: number, categoryData: {
  categoryName: string;
  slug: string;
}): Promise<{ code: number; message: string; data: { id: number; categoryName: string; slug: string } }> => {
  const response = await axios.put(`${API_URL}/categories/${categoryId}`, categoryData);
  return response.data;
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  await axios.delete(`${API_URL}/categories/${categoryId}`);
};

export const getAllCategoriesForAdmin = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data.data;
}; 