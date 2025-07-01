import React, { useEffect, useState } from 'react';
import { getAllFavorites } from '../../services/favoriteService';
import type { Product } from '../../types';
import ProductCard from '../../components/Card/productCard';



const Favorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getAllFavorites();
        setFavorites(data.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách yêu thích:', error);
      }
    };

    fetchFavorites();
  }, []);

 return (
  <div className="container mt-4">
    <h4 className="mb-3">Sản Phẩm Yêu Thích</h4>

    {favorites.length === 0 ? (
      <div className="text-center text-muted py-5">
        <p className="fs-5">Bạn chưa thích sản phẩm nào.</p>
      </div>
    ) : (
      <div className="row">
        {favorites.map((product) => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={product.productId}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default Favorites;
