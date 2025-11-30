import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import chatIcon from "../../assets/images/chat.png";
import "./Header.css";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartItemsCount();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const accountMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);

  const brands = [
    { name: "Apple", value: "apple" },
    { name: "Samsung", value: "samsung" },
    { name: "Xiaomi", value: "xiaomi" },
    { name: "Vivo", value: "vivo" },
    { name: "Huawei", value: "huawei" },
    { name: "Pixel", value: "pixel" },
    { name: "Redmi", value: "redmi" },
    { name: "Realme", value: "realme" },
    { name: "OPPO", value: "oppo" },
    { name: "Nokia", value: "nokia" },
    {name: "Phụ kiện", value: "accessories"}
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setShowAccountMenu(false);
      }
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target)
      ) {
        setShowCategoryMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowAccountMenu(false);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-marquee">
            <div className="header-marquee-track">
              <span>Hot! Giao nhanh - Giảm ngay 300k cho đơn hàng đầu tiên của quý khách!</span>
              <span>Hot! Giao nhanh - Giảm ngay 300k cho đơn hàng đầu tiên của quý khách!</span>
              <span>Hot! Giao nhanh - Giảm ngay 300k cho đơn hàng đầu tiên của quý khách!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            <Link to="/" className="logo">
              <h1>Trang chủ</h1>
            </Link>
            <nav className="nav">
              <div className="nav-item-wrapper" ref={categoryMenuRef}>
                <button
                  className="nav-link nav-link-dropdown"
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                >
                  Danh mục
                </button>
                {showCategoryMenu && (
                  <div className="category-dropdown">
                    <div className="category-dropdown-header">
                      <span>Hãng điện thoại</span>
                    </div>
                    <div className="category-dropdown-list">
                      {brands.map((brand) => (
                        <Link
                          key={brand.value}
                          to={`/products?category=phone&brand=${brand.value}`}
                          className="category-dropdown-item"
                          onClick={() => setShowCategoryMenu(false)}
                        >
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/products?category=tablet">Ưu đãi</Link>
              <Link to="/products?category=tablet">Hot</Link>
              <Link to="/news">Tin tức</Link>
              <Link to="/cart" className="cart-icon nav-cart">
                Giỏ hàng
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
              <Link to="/about">Giới thiệu</Link>
            </nav>

            <div className="header-actions">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const q = e.currentTarget.value.trim();
                      if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
                      else navigate("/search");
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling;
                    const q = input?.value?.trim() || "";
                    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
                    else navigate("/search");
                  }}
                >
                  Tìm kiếm
                </button>
              </div>

              <div className="account-menu-wrapper" ref={accountMenuRef}>
                <button
                  className="account-btn"
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                >
                  <span className="account-icon">👤</span>
                  <span className="account-text">Đăng nhập</span>
                </button>

                {showAccountMenu && (
                  <div className="account-dropdown">
                    {isAuthenticated ? (
                      <>
                        <div className="account-dropdown-header">
                          <span className="account-greeting">
                            Xin chào, {user?.name}
                          </span>
                        </div>
                        <div className="account-dropdown-divider"></div>
                        <Link
                          to="/profile"
                          className="account-dropdown-item"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Thông tin tài khoản
                        </Link>
                        <Link
                          to="/orders"
                          className="account-dropdown-item"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Đơn hàng của tôi
                        </Link>
                        {user?.role === "admin" && (
                          <Link
                            to="/admin"
                            className="account-dropdown-item"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Quản trị
                          </Link>
                        )}
                        <div className="account-dropdown-divider"></div>
                        <button
                          className="account-dropdown-item account-logout"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="account-dropdown-item"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Đăng nhập
                        </Link>
                        <Link
                          to="/register"
                          className="account-dropdown-item"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Đăng ký
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
