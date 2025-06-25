import { useEffect, useState } from 'react';
import { fetchHomeProducts } from '../services/productService';
import type { Product } from '../types';

const useRelatedProducts = (currentProduct: Product) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const data = await fetchHomeProducts();
        const allProducts: Product[] = [
          ...data.topRatedProducts,
          ...Object.values(data.productyByCategory).flat(),
        ];

        const filtered = allProducts.filter(
          (p) =>
            p.productId !== currentProduct.productId &&
            (p.brand === currentProduct.brand )
        );

        setRelatedProducts(filtered.slice(0, 5));
      } catch (err) {
        console.error('❌ Lỗi khi fetch sản phẩm liên quan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentProduct]);

  return { relatedProducts, loading };
};

export default useRelatedProducts;
