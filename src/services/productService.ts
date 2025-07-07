import type { PostRatingPayload, Product, Rating } from '../types/index';
import axiosInstance from './axiosInstance';


interface HomeProductResponse {
  topRatedProducts: Product[];
  productyByCategory: Record<string, Product[]>;
}

interface ProductDetailResponse {
  productDto: Product;
  relatedProducts: Product[];
  categories: { id: number; categoryName: string; slug: string }[];
  ratings: Rating[];
}

export const fetchHomeProducts = async (): Promise<HomeProductResponse> => {
  const res = await axiosInstance.get('/products/home');

  const text = res.data ? JSON.stringify(res.data) : '';
  if (!text) throw new Error('Response rỗng');

  const json = JSON.parse(text);
  const data = json.data;

  if (!data || !data.topRatedProducts || !data.productyByCategory) {
    console.warn('❌ Dữ liệu không đầy đủ:', json);
    throw new Error('Dữ liệu JSON không hợp lệ');
  }

  return data;
};

export const getProductBySlug = async (slug: string): Promise<ProductDetailResponse> => {
  const res = await axiosInstance.get(`/products/${slug}`);
  const json = res.data;

  if (!json.data) {
    console.warn('❌ Dữ liệu không hợp lệ:', json);
    throw new Error('Không có dữ liệu sản phẩm');
  }

  return json.data;
};

export const fetchProductsByCategory = async (
  slug: string,
  brandSlug?: string,
  ratingScore?: string
): Promise<Record<string, Product[]>> => {
  const params = new URLSearchParams();
  params.append('category', slug);
  if (brandSlug) {
    params.append('brand', brandSlug);
  }
  if (ratingScore) {
    params.append('ratingScore', ratingScore);
  }
  const res = await axiosInstance.get(`/products/filter?${params.toString()}`);
  return res.data.data;
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get('/products/filter');
  return res.data.data;
};

export const fetchProductsByBrand = async (brandSlug: string): Promise<Product[]> => {
  const res = await axiosInstance.get(`/products/filter?brand=${brandSlug}`);
  return res.data.data;
};

export const searchProducts = async (params: {
  searchName?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}): Promise<Product[]> => {
  const { searchName, minPrice, maxPrice, page = 1, pageSize = 8 } = params;
  const query = new URLSearchParams();
  if (searchName) query.append('searchName', searchName);
  if (minPrice !== undefined) query.append('minPrice', String(minPrice));
  if (maxPrice !== undefined) query.append('maxPrice', String(maxPrice));
  query.append('page', String(page));
  query.append('pageSize', String(pageSize));

  const res = await axiosInstance.get(`/products?${query.toString()}`);
  return res.data.data;
};

export async function postRating(payload: PostRatingPayload) {
  const response = await axiosInstance.post('/ratings', payload);

  if (!response || response.status >= 400) {
    const errorText = JSON.stringify(response.data || 'Gửi đánh giá thất bại');
    console.error('❌ Lỗi từ server:', errorText);
    throw new Error(errorText);
  }

  return response.data;
}

export async function putRating(payload: PostRatingPayload, ratingId: number) {
  const response = await axiosInstance.put(`/ratings/${ratingId}`, {
    ratingScore: payload.ratingScore,
    comment: payload.comment,
  });

  if (!response || response.status >= 400) {
    const errorText = JSON.stringify(response.data || 'Gửi đánh giá thất bại');
    console.error('❌ Lỗi từ server:', errorText);
    throw new Error(errorText);
  }

  return response.data;
}
