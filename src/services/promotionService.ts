import type { FormDataPromotionAddType } from '../types';
import axiosInstance from './axiosInstance';

export const fetchPromotions = async () => {
  const response = await axiosInstance.get('/promotions');
  return response.data.data;
}; 
export const createPromotion = async (data: FormDataPromotionAddType) => {
  try {
    const formattedData = { ...data }
    const response = await axiosInstance.post("/promotions", formattedData);
    
    if (!response?.data) {
      throw new Error("No data received from the server");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error creating promotion:", {
      message: error.message,
      data,
      status: error.response?.status,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || "Failed to create promotion"
    );
  }
};