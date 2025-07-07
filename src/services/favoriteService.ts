import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const token =
      sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');

export const toggleFavorite = async (productId: number) => {
  try {
    
    const response = await axios.post(
      `${API_URL}/favorites/${productId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Toggle favorite error:', error);
    throw error;
  }
};


export const getAllFavorites = async () => {
  try {
    const response = await axios.get(`${API_URL}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; 
  } catch (error) {
    console.error('Get all favorites error:', error);
    throw error;
  }
};
export const deleteFavorite = async (productId: number) => {


  try {
    const response = await axios.delete(`${API_URL}/favorites/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Delete favorite error:', error);
    throw error;
  }
};
