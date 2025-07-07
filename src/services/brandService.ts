import axios from "axios";
import type { Brand } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchBrands = async (): Promise<Brand[]> => {
  const res = await axios.get(`${API_URL}/brands`);
  return res.data.data;
}; 