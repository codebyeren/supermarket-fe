import type { Product } from '../types/index';
import axios from 'axios';

interface HomeProductResponse {
  topRatedProducts: Product[];
  productyByCategory: Record<string, Product[]>;
}
interface ProductDetailResponse {
  productDto: Product;
  relatedProducts: Product[];
}

export const fetchHomeProducts = async (): Promise<HomeProductResponse> => {
  const res = await fetch('http://localhost:5050/api/products/home');

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
  const res = await fetch(`http://localhost:5050/api/products/${slug}`);

  if (!res.ok) throw new Error('Lỗi HTTP: ' + res.status);

  const json = await res.json();

  if (!json.data) {
    console.warn('❌ Dữ liệu không hợp lệ:', json);
    throw new Error('Không có dữ liệu sản phẩm');
  }

  return json.data ;
};

export const fetchProductsByCategory = async (slug: string): Promise<Record<string, import("../types").Product[]>> => {
  const res = await axios.get(`http://localhost:5050/api/products/category/${slug}`);
  return res.data.data;
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  const res = await axios.get('http://localhost:5050/api/products');
  return res.data.data;
};

export const searchProducts = async (
  params: { searchName?: string; minPrice?: number; maxPrice?: number; page?: number; pageSize?: number }
): Promise<Product[]> => {
  const { searchName, minPrice, maxPrice, page = 1, pageSize = 8 } = params;
  const query = new URLSearchParams();
  if (searchName) query.append("searchName", searchName);
  if (minPrice !== undefined) query.append("minPrice", String(minPrice));
  if (maxPrice !== undefined) query.append("maxPrice", String(maxPrice));
  query.append("page", String(page));
  query.append("pageSize", String(pageSize));
  const res = await axios.get(`http://localhost:5050/api/products?${query.toString()}`);
  return res.data.data;
};


