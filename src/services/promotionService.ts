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
export const getPromotionById = async (promotionId: number) => {
  try {
    const response = await axiosInstance.get(`/promotions/${promotionId}`);
    if (!response?.data?.data) {
      throw new Error("No data received from the server");
    }
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching promotion by ID:", {
      message: error.message,
      status: error.response?.status,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || "Failed to fetch promotion detail"
    );
  }
};
export const attachProductToPromotion = async (promotionId: number, productId: number) => {
  try {
    const response = await axiosInstance.post(`/promotions/${promotionId}/products/${productId}`);
    if (!response?.data?.data) {
      throw new Error('Không nhận được phản hồi từ server');
    }
    return response.data;
  } catch (error: any) {
    console.error('Error attaching product to promotion:', {
      message: error.message,
      status: error.response?.status,
      response: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Gắn product thất bại');
  }
};
export const updateProductPromotionIsActive = async (
  promotionId: number,
  productId: number,
  isActive: boolean
) => {
  try {
    const response = await axiosInstance.put(
      `/promotions/${promotionId}/products/${productId}`,
      isActive,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating product-promotion isActive:', error);
    throw new Error(error.response?.data?.message || 'Failed to update isActive status');
  }
};


export const togglePromotionStatus = async (promotionId: number, newStatus: boolean) => {
  try {
    const response = await axiosInstance.put(`/promotions/${promotionId}`, newStatus, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling promotion status:', error);
    throw error;
  }
};
