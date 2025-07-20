import React, { useEffect, useLayoutEffect, useState } from 'react';
import { fetchHomeProducts } from '../../services/productService';

import type { Product } from '../../types/index';
import CarouselComponent from '../../components/Carousel/CarouselComponent';
import Notification from '../../components/Notification';
import Card from 'antd/es/card/Card';
import ProductCard from '../../components/Card/productCard';

const HomePage = () => {
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [showNotification, setShowNotification] = useState(false);
  const [success, setSuccess] = useState(true)
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        console.log("Mobile view active");
      } else {
        setIsMobile(false);
        console.log("Desktop view active");
      }
    };

    handleResize(); // kiểm tra lần đầu
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []

  )
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHomeProducts();
        setTopRatedProducts(data.topRatedProducts);
        setProductsByCategory(data.productyByCategory);
      } catch (error) {
        console.error('Error loading data:', error);
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

      {isMobile ? (
        <div className="container mx-auto px-2 sm:px-4">
          <h4 className="text-start px-2">Featured Products</h4>
          <div className="row gx-2 gy-3 px-2">
            {topRatedProducts.map(product => (
              <div className="col-6" key={product.productId}>
                <ProductCard
                  product={product}
                  onAddToCartSuccess={() => {
                    setSuccess(true);
                    setShowNotification(true);
                  }}
                  onAddToCartFail={() => {
                    setSuccess(false);
                    setShowNotification(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <CarouselComponent
          title="Featured Products"
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
      )}

      {Object.entries(productsByCategory).map(([categoryName, productList]) =>
        isMobile ? (
          <div
            key={categoryName}
            className="container mx-auto px-2 sm:px-4 mb-4"
          >
            <h5 className="text-start px-2 mb-2">{categoryName}</h5>
            <div className="row gx-2 gy-3 px-2">
              {productList.map(product => (
                <div className="col-6" key={product.productId}>
                  <ProductCard
                    product={product}
                    onAddToCartSuccess={() => {
                      setSuccess(true);
                      setShowNotification(true);
                    }}
                    onAddToCartFail={() => {
                      setSuccess(false);
                      setShowNotification(true);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <CarouselComponent
            key={categoryName}
            title={categoryName}
            products={productList}
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
        )
      )}


      {showNotification && (
        <Notification
          message={success ? 'Added to cart' : 'Add product failed'}
          duration={2000}
          borderColor={success ? 'green' : 'red'}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
