import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { ProductSkeleton } from "../../components/Skeleton/Skeleton";
import { productService } from "../../services/productService";
import "./Product.css";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chỉ nhận category (và brand nếu được truyền từ URL), không hiển thị UI bộ lọc tại đây
  const filters = useMemo(
    () => ({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      q: searchParams.get("q") || "",
    }),
    [searchParams]
  );

  const pageFromUrl = Number(searchParams.get("page") || 1);
  const [page, setPage] = useState(isNaN(pageFromUrl) ? 1 : pageFromUrl);
  const perPage = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");

  const categoryLabel = useMemo(() => {
    const map = {
      phone: "Điện thoại",
      tablet: "Máy tính bảng",
      accessory: "Phụ kiện",
    };
    return map[filters.category] || "";
  }, [filters.category]);

  const brandLabel = useMemo(() => {
    const brand = filters.brand || "";
    if (!brand) return "";
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  }, [filters.brand]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { items, pagination } =
          await productService.getProductsWithPagination({
            ...filters,
            page,
            limit: perPage,
          });
        setProducts(items);
        setTotalPages(pagination?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, page]);

  const pagedProducts = products;

  const goToPage = (p) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    setPage(clamped);
    const params = new URLSearchParams(searchParams.toString());
    if (clamped === 1) params.delete("page");
    else params.set("page", String(clamped));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applySearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchText) params.set("q", searchText);
    else params.delete("q");
    params.delete("page");
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Products Grid only (không sidebar bộ lọc) */}
        <div className="products-header">
          <h3>SẢN PHẨM</h3>
          <span className="products-count">{products.length} sản phẩm</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch();
              }}
              style={{
                padding: "8px 10px",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
              }}
            />
            <button className="btn" onClick={applySearch}>
              Lọc
            </button>
          </div>
        </div>

        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="no-products">Không tìm thấy sản phẩm</div>
        ) : (
          <>
            <div className="products-grid">
              {pagedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {totalPages > 1 && (
              <div
                className="pagination"
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                <button
                  className="btn"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      className={`btn ${p === page ? "btn-primary" : ""}`}
                      onClick={() => goToPage(p)}
                      disabled={p === page}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  className="btn"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
