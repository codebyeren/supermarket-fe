import React, { useState, useRef, useEffect } from "react";
import type { Category, Brand } from "../../types";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";

interface Props {
  categories: Category[];
  brands: Brand[];
}

// Tìm category cha của slug hiện tại
function findParentId(categories: Category[], slug: string | undefined): number | null {
  for (const cat of categories) {
    if (cat.children && cat.children.some(child => child.slug === slug)) {
      return cat.id;
    }
    if (cat.children) {
      const found = findParentId(cat.children, slug);
      if (found) return found;
    }
  }
  return null;
}

const CategorySidebar: React.FC<Props> = ({ categories, brands }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openedParentId, setOpenedParentId] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentBrand = searchParams.get('brand');

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpenedParentId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tìm parentId nếu đang chọn category con
  const parentIdOfSelected = findParentId(categories, slug);

  const handleBrandSelect = (brandSlug: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (brandSlug === 'all') {
      newSearchParams.delete('brand');
    } else {
      newSearchParams.set('brand', brandSlug);
    }
    setSearchParams(newSearchParams);
  };

  return (
    <nav
      ref={wrapperRef}
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px #eee",
        padding: 24,
        width: 280,
        maxWidth: "100%",
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
      <h3 style={{ margin: "0 0 20px 0", fontSize: 24, fontWeight: "bold", color: "#2e7d32" }}>
          Categories
        </h3>
        {/* All Categories */}
        <li style={{ margin: "8px 0" }}>
          <Link
            to="/category/all"
            style={{
              fontWeight: "bold",
              color: slug === "all" ? "#2e7d32" : "#222",
              background:  "transparent",
              borderRadius: 4,
              textDecoration: "none",
              padding: "8px 16px",
              display: "block",
              transition: "background 0.2s"
            }}
          >
            All
          </Link>
        </li>
        {categories.map(cat => {
          const isParentActive = slug === cat.slug || parentIdOfSelected === cat.id;
          return (
            <React.Fragment key={cat.id}>
              <li style={{ margin: "8px 0", position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: cat.children && cat.children.length > 0 ? "pointer" : "default"
                  }}
                >
                  <Link
                    to={`/category/${cat.slug}`}
                    onClick={e => {
                      if (cat.children && cat.children.length > 0) {
                        e.preventDefault();
                        setOpenedParentId(openedParentId === cat.id ? null : cat.id);
                        navigate(`/category/${cat.slug}`);
                      }
                    }}
                    style={{
                      fontWeight: "bold",
                      color: isParentActive ? "#2e7d32" : "#222",
                      background:  "transparent",
                      borderRadius: 4,
                      textDecoration: "none",
                      padding: "8px 16px",
                      flex: 1,
                      transition: "background 0.2s"
                    }}
                  >
                    {cat.categoryName}
                  </Link>
                  {cat.children && cat.children.length > 0 && (
                    <span style={{ marginLeft: 8, fontSize: 16, userSelect: "none" }}>
                      {openedParentId === cat.id ? "▲" : "▼"}
                    </span>
                  )}
                </div>
                {/* Dropdown category con */}
                {cat.children && cat.children.length > 0 && openedParentId === cat.id && (
                  <ul
                    style={{
                      listStyle: "none",
                      margin: "8px 0 0 0",
                      padding: 0,
                      background: "#fafafa",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px #eee",
                      position: "relative"
                    }}
                  >
                    {cat.children.map(child => (
                      <li key={child.id} style={{ margin: "0", padding: 0 }}>
                        <Link
                          to={`/category/${child.slug}`}
                          style={{
                            display: "block",
                            padding: "12px 16px",
                            color: "#222",
                            background: slug === child.slug ? "#fff" : "transparent",
                            border: slug === child.slug ? "2px solid #2e7d32" : "2px solid transparent",
                            borderRadius: 6,
                            margin: "6px 8px",
                            fontWeight: 500,
                            textDecoration: "none",
                            transition: "border 0.2s, background 0.2s"
                          }}
                        >
                          {child.categoryName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ul>

      {/* Brands Section */}
      <div style={{ marginTop: 40, borderTop: "1px solid #eee", paddingTop: 30 }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: 24, fontWeight: "bold", color: "#2e7d32" }}>
          Brands
        </h3>
        
        {/* All Brands Button */}
        <button
          onClick={() => handleBrandSelect('all')}
          style={{
            fontWeight: "bold",
            color: !currentBrand ? "#2e7d32" : "#222",
            background:  "transparent",
            border:  "2px solid transparent",
            borderRadius: 8,
            padding: "12px 16px",
            display: "block",
            width: "100%",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            marginBottom: 16
          }}
        >
          All
        </button>
        
        {/* Brands Grid Container */}
        <div
          style={{
            background: "#fafafa",
            borderRadius: 12,
            padding: 16,
            border: "1px solid #e0e0e0",
            maxHeight: "300px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#2e7d32 #f0f0f0"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
              alignItems: "start"
            }}
          >
            {brands.map(brand => (
              <button
                key={brand.id}
                onClick={() => handleBrandSelect(brand.slug)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 8px",
                  background: currentBrand === brand.slug ? "#e8f5e9" : "#fff",
                  border: currentBrand === brand.slug ? "2px solid #2e7d32" : "2px solid #e0e0e0",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  minHeight: "80px",
                  width: "100%",
                  textAlign: "center"
                }}
                onMouseEnter={(e) => {
                  if (currentBrand !== brand.slug) {
                    e.currentTarget.style.background = "#f5f5f5";
                    e.currentTarget.style.borderColor = "#2e7d32";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentBrand !== brand.slug) {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderColor = "#e0e0e0";
                  }
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: currentBrand === brand.slug ? "#2e7d32" : "#666",
                    marginBottom: 4,
                    lineHeight: 1.2
                  }}
                >
                  {brand.brandName}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CategorySidebar; 