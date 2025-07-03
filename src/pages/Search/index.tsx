import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/Card/productCard";
import Pagination from '../../components/Pagination';
import '../../components/Pagination.css';
import type { Product } from "../../types";

const PAGE_SIZE = 8;
const MIN_PRICE = 0;
const MAX_PRICE = 100;

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 8;

  // Responsive columns
  let gridColumns = 4;
  if (windowWidth < 600) gridColumns = 1;
  else if (windowWidth < 900) gridColumns = 2;

  // Filter state
  const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice") || MIN_PRICE));
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice") || MAX_PRICE));
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const searchName = searchParams.get("searchName") || "";

  // Fetch products
  useEffect(() => {
    // TODO: fetchAllProducts() hoặc lấy từ props/mock
    // Giả sử có hàm fetchAllProducts trả về toàn bộ sản phẩm
    import('../../services/productService').then(mod => {
      mod.fetchAllProducts().then(data => setAllProducts(data));
    });
  }, []);

  // Responsive: listen window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter FE
  useEffect(() => {
    let filtered = allProducts;
    if (searchName) filtered = filtered.filter(p => p.productName.toLowerCase().includes(searchName.toLowerCase()));
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    setProducts(filtered);
  }, [allProducts, searchName, minPrice, maxPrice]);

  // Xử lý filter giá
  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      setMinPrice(value > maxPrice ? maxPrice : value);
    } else {
      setMaxPrice(value < minPrice ? minPrice : value);
    }
  };

  // Khi nhập hoặc kéo thả xong thì filter
  const handlePriceCommit = () => {
    setPage(1);
    setSearchParams({
      searchName,
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      page: "1"
    });
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchParams({
      searchName,
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      page: String(newPage)
    });
  };

  // Tính tổng số trang
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Responsive layout
  const isMobile = windowWidth < 900;

  const paginatedProducts = products.slice((currentPage-1)*productsPerPage, currentPage*productsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, minPrice, maxPrice]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  return (
    <div style={{
      padding: isMobile ? 8 : 24,
      maxWidth: 1300,
      margin: "0 auto",
      display: "flex",
      gap: isMobile ? 0 : 32,
      flexDirection: isMobile ? "column" : "row"
    }}>
      {/* Sidebar filter */}
      <aside style={{
        width: isMobile ? "100%" : 320,
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 4px 24px #e0f2f1",
        padding: isMobile ? 16 : 36,
        height: "fit-content",
        border: "2px solid #2e7d32",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: isMobile ? 24 : 0
      }}>
        <div style={{ fontWeight: 700, marginBottom: 24, fontSize: 24, color: '#2e7d32', letterSpacing: 1, textAlign: 'center' }}>Bộ lọc sản phẩm</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, marginBottom: 12, display: 'block', color: '#222', fontSize: 16, textAlign: 'center' }}>Khoảng giá (₫)</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, justifyContent: 'center' }}>
            <input
              type="number"
              min={MIN_PRICE}
              max={maxPrice}
              value={minPrice}
              onChange={e => handlePriceChange('min', Number(e.target.value))}
              onBlur={handlePriceCommit}
              style={{ width: 90, padding: 10, borderRadius: 10, border: "1.5px solid #2e7d32", fontWeight: 500, color: '#2e7d32', background: '#f9fff9', textAlign: 'center', fontSize: 16 }}
            />
            <span style={{ color: '#888', fontWeight: 600, fontSize: 18 }}>-</span>
            <input
              type="number"
              min={minPrice}
              max={MAX_PRICE}
              value={maxPrice}
              onChange={e => handlePriceChange('max', Number(e.target.value))}
              onBlur={handlePriceCommit}
              style={{ width: 90, padding: 10, borderRadius: 10, border: "1.5px solid #2e7d32", fontWeight: 500, color: '#2e7d32', background: '#f9fff9', textAlign: 'center', fontSize: 16 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10, width: '100%', justifyContent: 'center' }}>
            <input
              type="range"
              min={MIN_PRICE}
              max={maxPrice}
              value={minPrice}
              onChange={e => handlePriceChange('min', Number(e.target.value))}
              onMouseUp={handlePriceCommit}
              onTouchEnd={handlePriceCommit}
              style={{ flex: 1, accentColor: '#2e7d32', marginRight: 8 }}
            />
            <input
              type="range"
              min={minPrice}
              max={MAX_PRICE}
              value={maxPrice}
              onChange={e => handlePriceChange('max', Number(e.target.value))}
              onMouseUp={handlePriceCommit}
              onTouchEnd={handlePriceCommit}
              style={{ flex: 1, accentColor: '#2e7d32', marginLeft: 8 }}
            />
          </div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 8, textAlign: 'center', fontStyle: 'italic', maxWidth: 220 }}>
            Bạn có thể nhập hoặc kéo để chọn khoảng giá muốn lọc sản phẩm phù hợp với nhu cầu của mình.
          </div>
        </div>
      </aside>
      {/* Main content */}
      <main style={{ flex: 1 }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gap: isMobile ? 16 : 32,
              justifyItems: 'center',
              justifyContent: 'center'
            }}>
              {paginatedProducts.map(product => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </main>
    </div>
  );
};

export default SearchPage; 