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
    // const sortOrder: (keyof SortState)[] = ['price', 'name', 'rating'];
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
    label: 'Price',
    options: [
      { value: 'asc', label: 'Ascending', description: 'Price from low to high' },
      { value: 'desc', label: 'Descending', description: 'Price from high to low' },
    ]
  },
  {
    key: 'name',
    label: 'Name',
    options: [
      { value: 'asc', label: 'A-Z', description: 'Name from A to Z' },
      { value: 'desc', label: 'Z-A', description: 'Name from Z to A' },
    ]
  },
  {
    key: 'rating',
    label: 'Rating',
    options: [
      { value: 'desc', label: 'Highest', description: 'Rating from high to low' },
      { value: 'asc', label: 'Lowest', description: 'Rating from low to high' },
    ]
  },
  {
    key: 'date',
    label: 'Date',
    options: [
      { value: 'desc', label: 'Newest', description: 'Latest creation date' },
      { value: 'asc', label: 'Oldest', description: 'Oldest creation date' },
    ]
  },
] as const; 