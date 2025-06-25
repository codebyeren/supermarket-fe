import React, { useEffect, useState } from 'react';
import { fetchHomeProducts } from '../../services/productService';
import ProductCard from '../../components/Card/productCard';
import type { Product } from '../../types/index';

const HomePage = () => {
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});

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

      {topRatedProducts.length > 0 && (
        <section className='mb-5'>
          <h4 className="mb-3 text-start">Sản Phẩm Nổi Bật</h4>
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {topRatedProducts.map((product) => (
              <div className="col-6 col-md-3" key={product.productId}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {Object.entries(productsByCategory).map(([categoryName, productList]) => (
        <section key={categoryName} className="mb-5">
          <h4 className="mb-3 text-start">{categoryName}</h4>
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {productList.slice(0, 4).map((product) => (
              <div className="col-6 col-md-3" key={product.productId}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default HomePage;
