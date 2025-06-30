import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchCategories } from "../../services/categoryService";
import { fetchBrands } from "../../services/brandService";
import { fetchProductsByCategory, fetchAllProducts, fetchProductsByBrand } from "../../services/productService";
import type { Category, Product, Brand } from "../../types";
import CategorySidebar from "../../components/CategorySidebar";
import ProductCard from "../../components/Card/productCard";

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const currentBrand = searchParams.get('brand');

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
          fetchProductsByBrand(currentBrand)
            .then(setProducts)
            .finally(() => setLoading(false));
        } else {
          fetchAllProducts()
            .then(setProducts)
            .finally(() => setLoading(false));
        }
      } else {
        fetchProductsByCategory(slug, currentBrand || undefined)
          .then((data) => {
            const allProducts = Object.values(data).flat();
            setProducts(allProducts);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [slug, currentBrand]);

  // Responsive: listen window resize
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 900;

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
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: isMobile ? 16 : 24,
            justifyItems: 'center',
            justifyContent: 'center'
          }}>
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage; 