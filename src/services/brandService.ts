import axios from "axios";
import type { Brand } from "../types";

export const fetchBrands = async (): Promise<Brand[]> => {
  const res = await axios.get("http://localhost:5050/api/brands");
  return res.data.data;
}; 