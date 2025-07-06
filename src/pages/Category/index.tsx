import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchCategories } from "../../services/categoryService";
import { fetchBrands } from "../../services/brandService";
import { fetchProductsByCategory, fetchAllProducts, fetchProductsByBrand } from "../../services/productService";
import type { Category, Product, Brand } from "../../types";
import CategorySidebar from "../../components/CategorySidebar";
import ProductCard from "../../components/Card/productCard";
import Pagination from '../../components/Pagination';
import SortPanel from '../../components/SortPanel';
import { sortProducts, sortGroups } from '../../utils/sortUtils';
import type { SortState } from '../../utils/sortUtils';
import '../../components/Pagination.css';

function parseSortState(sortParam: string | null): SortState {
  if (!sortParam) return {};
  const state: SortState = {};
  sortParam.split(',').forEach(pair => {
    const [key, value] = pair.split(':');
    if (key && value && ['asc','desc'].includes(value)) {
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

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const currentBrand = searchParams.get('brand');
  const currentRating = searchParams.get('ratingScore');
  const sortState = useMemo(() => parseSortState(searchParams.get('sort')), [searchParams]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  
  // Sort products
  const sortedProducts = useMemo(() => {
    return sortProducts(products, sortState);
  }, [products, sortState]);
  
  const paginatedProducts = sortedProducts.slice((currentPage-1)*productsPerPage, currentPage*productsPerPage);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Responsive columns
  let gridColumns = 4;
  if (windowWidth < 600) gridColumns = 1;
  else if (windowWidth < 900) gridColumns = 2;

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchBrands().then(setBrands);
  }, []);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      if (slug === "all") {
        if (currentBrand) {
          fetchProductsByBrand(currentBrand, currentRating || undefined)
            .then(setProducts)
            .finally(() => setLoading(false));
        } else {
          fetchAllProducts(currentRating || undefined)
            .then(setProducts)
            .finally(() => setLoading(false));
        }
      } else {
        fetchProductsByCategory(slug, currentBrand || undefined, currentRating || undefined)
          .then((data) => {
            const allProducts = Object.values(data).flat();
            setProducts(allProducts);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [slug, currentBrand, currentRating]);

  useEffect(() => {
    setCurrentPage(1);
  }, [products, currentRating, sortState]);

  // Responsive: listen window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 900;

  const handleSortChange = (key: keyof SortState, value: 'asc' | 'desc' | undefined) => {
    const newSortState: SortState = { ...sortState, [key]: value };
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sort', stringifySortState(newSortState));
    setSearchParams(newSearchParams);
  };

  return (
    <div style={{
      display: "flex",
      gap: isMobile ? 0 : 32,
      padding: isMobile ? 8 : 24,
      flexDirection: isMobile ? "column" : "row",
      maxWidth: 1400,
      minHeight: "90vh",
      margin: "0 auto"
    }}>
      <aside style={{
        background: "#fff",
        maxWidth: isMobile ? "100%" : 320,
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
        padding: isMobile ? 12 : 16,
        marginBottom: isMobile ? 24 : 0,
        flexShrink: 0
      }}>
        <CategorySidebar categories={categories} brands={brands} />
      </aside>
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
              gap: isMobile ? 16 : 24,
              justifyItems: 'center',
              justifyContent: 'center'
            }}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          </>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>
    </div>
  );
};

export default CategoryPage; 