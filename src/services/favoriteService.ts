import axios from 'axios';


const token =
      sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');

export const toggleFavorite = async (productId: number) => {
  try {
    
    const response = await axios.post(
      `http://localhost:5050/api/favorites/${productId}`,
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
    const response = await axios.get('http://localhost:5050/api/favorites', {
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
    const response = await axios.delete(`http://localhost:5050/api/favorites/${productId}`, {
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
