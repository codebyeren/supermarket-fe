import axiosInstance from './axiosInstance';

export const fetchPromotions = async () => {
  const response = await axiosInstance.get('/promotions');
  return response.data.data;
}; 