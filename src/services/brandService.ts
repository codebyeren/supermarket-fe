import axios from "axios";
import type { Brand } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchBrands = async (): Promise<Brand[]> => {
  const res = await axios.get(`${API_URL}/brands`);
  return res.data.data;
};

// Admin APIs
export const createBrand = async (brandData: {
  brandName: string;
  slug: string;
}): Promise<{ code: number; message: string; data: { id: number; brandName: string; slug: string } }> => {
  const response = await axios.post(`${API_URL}/brands`, brandData);
  return response.data;
};

export const updateBrand = async (brandId: number, brandData: {
  brandName: string;
  slug: string;
}): Promise<{ code: number; message: string; data: { id: number; brandName: string; slug: string } }> => {
  const response = await axios.put(`${API_URL}/brands/${brandId}`, brandData);
  return response.data;
};

export const deleteBrand = async (brandId: number): Promise<void> => {
  await axios.delete(`${API_URL}/brands/${brandId}`);
};

export const getAllBrandsForAdmin = async (): Promise<Brand[]> => {
  const response = await axios.get(`${API_URL}/brands`);
  return response.data.data;
}; 