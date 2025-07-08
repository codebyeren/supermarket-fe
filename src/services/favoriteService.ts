
import axiosInstance from './axiosInstance';


export const toggleFavorite = async (productId: number) => {
  try {
    const response = await axiosInstance.post(`/favorites/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Toggle favorite error:', error);
    throw error;
  }
};

export const getAllFavorites = async () => {
  try {
    const response = await axiosInstance.get(`/favorites`);
    return response.data;
  } catch (error) {
    console.error('Get all favorites error:', error);
    throw error;
  }
};


export const deleteFavorite = async (productId: number) => {
  try {
    const response = await axiosInstance.delete(`/favorites/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Delete favorite error:', error);
    throw error;
  }
};
