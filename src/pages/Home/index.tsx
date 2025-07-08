import React, { useEffect, useState } from 'react';
import { fetchHomeProducts } from '../../services/productService';

import type { Product } from '../../types/index';
import CarouselComponent from '../../components/Carousel/CarouselComponent';
import Notification from '../../components/Notification';

const HomePage = () => {
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [showNotification, setShowNotification] = useState(false);
  const [success, setSuccess] = useState(true)
  useEffect(() => {


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

      <CarouselComponent
        title="Sản Phẩm Nổi Bật"
        products={topRatedProducts}
        itemsPerView={{ desktop: 5, tablet: 3, mobile: 2 }}
        onAddToCartSuccess={() => {
          setSuccess(true);
          setShowNotification(true);
        }}
        onAddToCartFail={() => {
          setSuccess(false);
          setShowNotification(true);
        }}
      />


      {Object.entries(productsByCategory).map(([categoryName, productList]) => (
        <CarouselComponent
          key={categoryName} title={categoryName} products={productList}
          itemsPerView={{ desktop: 5, tablet: 3, mobile: 2 }}
          onAddToCartSuccess={() => {
            setSuccess(true);
            setShowNotification(true);
          }}
          onAddToCartFail={() => {
            setSuccess(false);
            setShowNotification(true);
          }}
        />

      ))}
      {showNotification && (
        <Notification
          message={success ? 'Đã thêm vào giỏ hàng' : 'Thêm sản phẩm thất bại'}
          duration={2000}
          borderColor={success ? 'green' : 'red'}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
