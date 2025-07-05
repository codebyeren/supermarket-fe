import React, { useEffect, useState } from 'react';
import { getAllFavorites } from '../../services/favoriteService';
import type { Product } from '../../types';
import ProductCard from '../../components/Card/productCard';
import Sidebar from '../../components/SideBar';

const Favorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getAllFavorites();
        setFavorites(data.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách yêu thích:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
      <div className="container-fluid min-vh-100 bg-light">
        <div className="d-flex flex-column flex-lg-row gap-4 py-4" style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Sidebar */}
          <aside className="bg-white rounded shadow-sm p-3" style={{ minWidth: 280, flexShrink: 0 }}>
            <Sidebar />
          </aside>
  

        {/* Main content */}
        <main className="flex-grow-1 bg-white shadow-sm rounded p-4">
          <h4 className="mb-4">Sản Phẩm Yêu Thích</h4>

          {loading ? (
            <p>Đang tải...</p>
          ) : favorites.length === 0 ? (
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
        </main>
      </div>
    </div>
  );
};

export default Favorites;
