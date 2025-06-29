import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCategories } from "../../services/categoryService";
import { fetchProductsByCategory, fetchAllProducts } from "../../services/productService";
import type { Category, Product } from "../../types";
import CategorySidebar from "../../components/CategorySidebar";
import ProductCard from "../../components/Card/productCard";

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Responsive columns
  let gridColumns = 4;
  if (windowWidth < 600) gridColumns = 1;
  else if (windowWidth < 900) gridColumns = 2;

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      if (slug === "all") {
        fetchAllProducts()
          .then(setProducts)
          .finally(() => setLoading(false));
      } else {
        fetchProductsByCategory(slug)
          .then((data) => {
            const allProducts = Object.values(data).flat();
            setProducts(allProducts);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [slug]);

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
      maxWidth: 1300,
      minHeight: "90vh",
      margin: "0 auto"
    }}>
      <aside style={{
     
        background: "#fff",
        maxWidth: isMobile ? "100%" : 250,
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
        padding: isMobile ? 12 : 16,
        marginBottom: isMobile ? 24 : 0
      }}>
        <CategorySidebar categories={categories} />
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