import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { productService } from "../../services/productService";
import "./Home.css";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: "phone", name: "Điện thoại", icon: "📱" },
    { id: "tablet", name: "Tablet", icon: "📱" },
    { id: "accessories", name: "Phụ kiện", icon: "🎧" },
  ];

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="banner-slider">
          <div className="banner-item">
            <h2>iPhone 17 Series</h2>
            <p>Mua ngay với giá ưu đãi</p>
            <Link
              to="/products?category=phone&brand=apple"
              className="btn btn-primary"
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Sản phẩm nổi bật</h2>
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="section-footer">
            <Link to="/products" className="btn">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="promotions-section">
        <div className="container">
          <div className="promotion-cards">
            <div className="promotion-card">
              <h3>Ưu đãi cho giáo dục</h3>
              <p>Giảm thêm đến 500K cho sinh viên</p>
            </div>
            <div className="promotion-card">
              <h3>Thu cũ đổi mới</h3>
              <p>Trợ giá đến 5 triệu</p>
            </div>
            <div className="promotion-card">
              <h3>Ưu đãi Member</h3>
              <p>Tích điểm, đổi quà hấp dẫn</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Feed */}
      <section className="newsfeed-section">
        <div className="container">
          <h2 className="section-title">Tin tức & Công nghệ</h2>
          <div className="newsfeed-grid">
            <article className="news-card">
              <div className="news-image">
                <img src="https://via.placeholder.com/400x250" alt="Tin tức" />
              </div>
              <div className="news-content">
                <span className="news-category">Công nghệ</span>
                <h3 className="news-title">
                  iPhone 17 Pro Max: Đánh giá chi tiết sau 1 tháng sử dụng
                </h3>
                <p className="news-excerpt">
                  Trải nghiệm thực tế với iPhone 17 Pro Max - những điểm mạnh và
                  điểm cần cải thiện...
                </p>
                <div className="news-meta">
                  <span className="news-date">15/01/2025</span>
                  <Link to="/news/1" className="news-link">
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            </article>

            <article className="news-card">
              <div className="news-image">
                <img src="https://via.placeholder.com/400x250" alt="Tin tức" />
              </div>
              <div className="news-content">
                <span className="news-category">Đánh giá</span>
                <h3 className="news-title">
                  So sánh Samsung Galaxy S24 Ultra vs iPhone 15 Pro Max
                </h3>
                <p className="news-excerpt">
                  Cuộc chiến giữa hai flagship hàng đầu: đâu là lựa chọn tốt
                  nhất cho bạn?
                </p>
                <div className="news-meta">
                  <span className="news-date">12/01/2025</span>
                  <Link to="/news/2" className="news-link">
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            </article>

            <article className="news-card">
              <div className="news-image">
                <img src="https://via.placeholder.com/400x250" alt="Tin tức" />
              </div>
              <div className="news-content">
                <span className="news-category">Mẹo vặt</span>
                <h3 className="news-title">
                  10 mẹo tiết kiệm pin cho điện thoại bạn nên biết
                </h3>
                <p className="news-excerpt">
                  Những cách đơn giản để kéo dài thời lượng pin và tối ưu hiệu
                  suất thiết bị...
                </p>
                <div className="news-meta">
                  <span className="news-date">10/01/2025</span>
                  <Link to="/news/3" className="news-link">
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            </article>

            <article className="news-card">
              <div className="news-image">
                <img src="https://via.placeholder.com/400x250" alt="Tin tức" />
              </div>
              <div className="news-content">
                <span className="news-category">Khuyến mãi</span>
                <h3 className="news-title">
                  Chương trình thu cũ đổi mới: Trợ giá lên đến 5 triệu
                </h3>
                <p className="news-excerpt">
                  Cơ hội đổi điện thoại cũ lấy máy mới với giá ưu đãi đặc biệt
                  trong tháng này...
                </p>
                <div className="news-meta">
                  <span className="news-date">08/01/2025</span>
                  <Link to="/news/4" className="news-link">
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            </article>
          </div>
          <div className="section-footer">
            <Link to="/news" className="btn">
              Xem tất cả tin tức
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
