import React, { useEffect, useState } from 'react';
import { fetchHomeProducts } from '../../services/productService';

import type { Product } from '../../types/index';
import CarouselComponent from '../../components/Carousel/CarouselComponent';

const HomePage = () => {
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});

 useEffect(() => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  console.log(token)

  const loadData = async () => {
    try {
      const data = await fetchHomeProducts();
      setTopRatedProducts(data.topRatedProducts);
      setProductsByCategory(data.productyByCategory);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  loadData();
}, []);


  return (
    <div className="container my-4">
      <div className="mb-4">
        <img
          src="/banner1.jpg"
          alt="Banner"
          className="img-fluid rounded w-100"
        />
      </div>

      {topRatedProducts.length > 0 && (
        <CarouselComponent title="Sản Phẩm Nổi Bật" products={topRatedProducts} />
      )}

      {Object.entries(productsByCategory).map(([categoryName, productList]) => (
        <CarouselComponent key={categoryName} title={categoryName} products={productList} />
      ))}
    </div>
  );
};

export default HomePage;
