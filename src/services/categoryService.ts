import axios from "axios";
import type { Category } from "../types";

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
  const res = await axios.get("http://localhost:5050/api/categories");
  const apiData = res.data.data;
  return Array.isArray(apiData) ? apiData.map(mapCategoryApiToFE) : [];
}; 