import type { Product } from '../types';

export type SortState = {
  price?: 'asc' | 'desc';
  name?: 'asc' | 'desc';
  rating?: 'asc' | 'desc';
  date?: 'asc' | 'desc';
};

export const sortProducts = (products: Product[], sortState: SortState): Product[] => {
  const sortedProducts = [...products];
  const sortOrder: (keyof SortState)[] = ['price', 'name', 'rating', 'date'];
  return sortedProducts.sort((a, b) => {
    for (const key of sortOrder) {
      const dir = sortState[key];
      if (!dir) continue;
      const result = compareProducts(a, b, key, dir);
      if (result !== 0) return result;
    }
    return 0;
  });
};

const compareProducts = (a: Product, b: Product, key: keyof SortState, dir: 'asc' | 'desc'): number => {
  switch (key) {
    case 'price':
      return dir === 'asc' ? a.price - b.price : b.price - a.price;
    case 'name':
      return dir === 'asc' ? a.productName.localeCompare(b.productName) : b.productName.localeCompare(a.productName);
    case 'rating':
      return dir === 'asc' ? (a.ratingScore || 0) - (b.ratingScore || 0) : (b.ratingScore || 0) - (a.ratingScore || 0);
    case 'date':
      const dateA = new Date(a.startDate || '1970-01-01');
      const dateB = new Date(b.startDate || '1970-01-01');
      return dir === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    default:
      return 0;
  }
};

export const sortGroups = [
  {
    key: 'price',
    label: 'Giá',
    options: [
      { value: 'asc', label: 'Tăng dần', description: 'Giá từ thấp đến cao' },
      { value: 'desc', label: 'Giảm dần', description: 'Giá từ cao đến thấp' },
    ]
  },
  {
    key: 'name',
    label: 'Tên',
    options: [
      { value: 'asc', label: 'A-Z', description: 'Tên từ A đến Z' },
      { value: 'desc', label: 'Z-A', description: 'Tên từ Z đến A' },
    ]
  },
  {
    key: 'rating',
    label: 'Đánh giá',
    options: [
      { value: 'desc', label: 'Cao nhất', description: 'Đánh giá từ cao đến thấp' },
      { value: 'asc', label: 'Thấp nhất', description: 'Đánh giá từ thấp đến cao' },
    ]
  },
  {
    key: 'date',
    label: 'Ngày',
    options: [
      { value: 'desc', label: 'Mới nhất', description: 'Ngày tạo mới nhất' },
      { value: 'asc', label: 'Cũ nhất', description: 'Ngày tạo cũ nhất' },
    ]
  },
] as const; 