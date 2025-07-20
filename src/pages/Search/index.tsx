import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/Card/productCard";
import Pagination from '../../components/Pagination';
import SortPanel from '../../components/SortPanel';
import { sortProducts, sortGroups } from '../../utils/sortUtils';
import type { SortState } from '../../utils/sortUtils';
import '../../components/Pagination.css';
import type { Product } from "../../types";
import { fetchAllProducts } from '../../services/productService';
import axiosInstance from '../../services/axiosInstance';
import Notification from "../../components/Notification";

const PAGE_SIZE = 8;
const MIN_PRICE = 0;
const MAX_PRICE = 100;

function parseSortState(sortParam: string | null): SortState {
  if (!sortParam) return {};
  const state: SortState = {};
  sortParam.split(',').forEach(pair => {
    const [key, value] = pair.split(':');
    if (key && value && ['asc', 'desc'].includes(value)) {
      (state as any)[key] = value;
    }
  });
  return state;
}
function stringifySortState(state: SortState): string {
  return Object.entries(state)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k}:${v}`)
    .join(',');
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [success, setSuccess] = useState(true)

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
  const sortState = useMemo(() => parseSortState(searchParams.get('sort')), [searchParams]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchParams.get('category')) params.append('category', searchParams.get('category')!);
    if (searchParams.get('brand')) params.append('brand', searchParams.get('brand')!);
    if (searchParams.get('ratingScore')) params.append('ratingScore', searchParams.get('ratingScore')!);
    axiosInstance.get(`/products/filter?${params.toString()}`)
      .then(res => {
        setAllProducts(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

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
    const params: Record<string, string> = {
      searchName,
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      page: "1"
    };
    if (Object.keys(sortState).length > 0) {
      params.sort = stringifySortState(sortState);
    }
    setSearchParams(params);
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params: Record<string, string> = {
      searchName,
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      page: String(newPage)
    };
    if (Object.keys(sortState).length > 0) {
      params.sort = stringifySortState(sortState);
    }
    setSearchParams(params);
  };

  // Responsive layout
  const isMobile = windowWidth < 900;

  // Sort products
  const sortedProducts = useMemo(() => {
    return sortProducts(products, sortState);
  }, [products, sortState]);

  const paginatedProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  // Tính tổng số trang
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, minPrice, maxPrice, sortState]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const handleSortChange = (key: keyof SortState, value: 'asc' | 'desc' | undefined) => {
    const newSortState: SortState = { ...sortState, [key]: value };
    const params: Record<string, string> = {
      searchName,
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      page: String(page)
    };
    if (Object.keys(newSortState).length > 0) {
      params.sort = stringifySortState(newSortState);
    }
    setSearchParams(params);
  };

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
        border: "2px solid #7c3aed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: isMobile ? 24 : 0
      }}>
        <div style={{ fontWeight: 700, marginBottom: 24, fontSize: 24, color: '#7c3aed', letterSpacing: 1, textAlign: 'center' }}>Product Filters</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, marginBottom: 12, display: 'block', color: '#222', fontSize: 16, textAlign: 'center' }}>Price Range (₫)</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, justifyContent: 'center' }}>
            <input
              type="number"
              min={MIN_PRICE}
              max={maxPrice}
              value={minPrice}
              onChange={e => handlePriceChange('min', Number(e.target.value))}
              onBlur={handlePriceCommit}
              style={{ width: 90, padding: 10, borderRadius: 10, border: "1.5px solid #7c3aed", fontWeight: 500, color: '#7c3aed', background: '#f9fff9', textAlign: 'center', fontSize: 16 }}
            />
            <span style={{ color: '#888', fontWeight: 600, fontSize: 18 }}>-</span>
            <input
              type="number"
              min={minPrice}
              max={MAX_PRICE}
              value={maxPrice}
              onChange={e => handlePriceChange('max', Number(e.target.value))}
              onBlur={handlePriceCommit}
              style={{ width: 90, padding: 10, borderRadius: 10, border: "1.5px solid #7c3aed", fontWeight: 500, color: '#7c3aed', background: '#f9fff9', textAlign: 'center', fontSize: 16 }}
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
              style={{ flex: 1, accentColor: '#7c3aed', marginRight: 8 }}
            />
            <input
              type="range"
              min={minPrice}
              max={MAX_PRICE}
              value={maxPrice}
              onChange={e => handlePriceChange('max', Number(e.target.value))}
              onMouseUp={handlePriceCommit}
              onTouchEnd={handlePriceCommit}
              style={{ flex: 1, accentColor: '#7c3aed', marginLeft: 8 }}
            />
          </div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 8, textAlign: 'center', fontStyle: 'italic', maxWidth: 220 }}>
            You can enter or drag to select the price range to filter products that suit your needs.
          </div>
        </div>
      </aside>
      {/* Main content */}
      <main style={{ flex: 1 }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <SortPanel
              sortState={sortState}
              onSortChange={handleSortChange}
              sortGroups={sortGroups as any as { key: keyof SortState; label: string; options: { value: 'asc' | 'desc'; label: string; description: string }[]; }[]}
            />
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gap: isMobile ? 16 : 32,
              justifyItems: 'center',
              justifyContent: 'center'
            }}>
              {paginatedProducts.map(product => (
                <ProductCard key={product.productId} product={product} onAddToCartSuccess={() => {
                  setSuccess(true);
                  setShowNotification(true);
                }}
                  onAddToCartFail={() => {
                    setSuccess(false);
                    setShowNotification(true);
                  }} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            {showNotification && (
              <Notification
                message={success ? 'Added to cart' : 'Add to cart failed'}
                duration={2000}
                borderColor={success ? 'green' : 'red'}
                onClose={() => setShowNotification(false)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SearchPage; 