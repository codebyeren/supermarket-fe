import type { PostRatingPayload, Product, Rating } from '../types/index';
import axios from 'axios';

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

const token =
  sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
export const fetchHomeProducts = async (): Promise<HomeProductResponse> => {
  const res = await fetch('http://localhost:5050/api/products/home', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) throw new Error('Lỗi HTTP: ' + res.status);

  const text = await res.text();
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
  const res = await fetch(`http://localhost:5050/api/products/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error('Lỗi HTTP: ' + res.status);

  const json = await res.json();

  if (!json.data) {
    console.warn('❌ Dữ liệu không hợp lệ:', json);
    throw new Error('Không có dữ liệu sản phẩm');
  }

  return json.data;
};

export const fetchProductsByCategory = async (slug: string, brandSlug?: string, ratingScore?: string): Promise<Record<string, import("../types").Product[]>> => {
  const params = new URLSearchParams();
  params.append('category', slug);
  if (brandSlug) {
    params.append('brand', brandSlug);
  }
  if (ratingScore) {
    params.append('ratingScore', ratingScore);
  }
  const res = await axios.get(`http://localhost:5050/api/products/filter?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data.data;
};

export const fetchAllProducts = async (ratingScore?: string): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (ratingScore) {
    params.append('ratingScore', ratingScore);
  }
  const res = await axios.get(`http://localhost:5050/api/products/filter?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  }
  );
  return res.data.data;
};

export const fetchProductsByBrand = async (brandSlug: string, ratingScore?: string): Promise<Product[]> => {
  const params = new URLSearchParams();
  params.append('brand', brandSlug);
  if (ratingScore) {
    params.append('ratingScore', ratingScore);
  }
  const res = await axios.get(`http://localhost:5050/api/products/filter?${params.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  return res.data.data;
};

export const searchProducts = async (
  params: { searchName?: string; minPrice?: number; maxPrice?: number; page?: number; pageSize?: number },

): Promise<Product[]> => {
  const { searchName, minPrice, maxPrice, page = 1, pageSize = 8 } = params;
  const query = new URLSearchParams();
  if (searchName) query.append("searchName", searchName);
  if (minPrice !== undefined) query.append("minPrice", String(minPrice));
  if (maxPrice !== undefined) query.append("maxPrice", String(maxPrice));
  query.append("page", String(page));
  query.append("pageSize", String(pageSize));

  const res = await axios.get(`http://localhost:5050/api/products?${query.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return res.data.data;
};

export async function postRating(payload: PostRatingPayload) {
  const response = await fetch('http://localhost:5050/api/ratings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),

    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error('❌ Lỗi từ server:', errorText);
    throw new Error(errorText || 'Gửi đánh giá thất bại');
  }


  return await response.json();
}
export async function putRating(payload: PostRatingPayload, ratingId: number) {
  const response = await fetch(`http://localhost:5050/api/ratings/${ratingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      ratingScore: payload.ratingScore,
      comment: payload.comment,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Lỗi từ server:', errorText);
    throw new Error(errorText || 'Gửi đánh giá thất bại');
  }

  return await response.json();
}

