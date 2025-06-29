import React, { useState, useRef, useEffect } from "react";
import type { Category } from "../../types";
import { Link, useParams, useNavigate } from "react-router-dom";

interface Props {
  categories: Category[];
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

const CategorySidebar: React.FC<Props> = ({ categories }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [openedParentId, setOpenedParentId] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  return (
    <nav
      ref={wrapperRef}
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px #eee",
        padding: 20,
        minWidth: 220,
        position: "relative"
      }}
    >
      <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
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
            All Categories
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
    </nav>
  );
};

export default CategorySidebar; 