import axios from "axios";
import type { Category } from "../types";

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get("http://localhost:5050/api/categories");
  return res.data.data;
}; 