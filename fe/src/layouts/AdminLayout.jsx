import { Outlet, Link } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 align="center">Admin Dashboard</h2>
        <nav>
          <Link to="/admin/products" align="center">
            {" "}
            Quản lý sản phẩm
          </Link>
          <Link to="/admin/users" align="center">
            {" "}
            Quản lý tài khoản
          </Link>
          <Link to="/admin/carts" align="center">
            {" "}
            Quản lý giỏ hàng
          </Link>
          <Link to="/admin/orders" align="center">
            {" "}
            Quản lý đơn hàng
          </Link>
          <Link to="/admin/inventory" align="center">
            {" "}
            Quản lý tồn kho
          </Link>
          <Link to="/admin/reports" align="center">
            {" "}
            Báo cáo-Thống kê & Xuất file PDF
          </Link>
          <Link to="/admin/news" align="center">
            {" "}
            Quản lý tin tức
          </Link>
          <Link to="/admin/reviews" align="center">
            {" "}
            Quản lý đánh giá sản phẩm
          </Link>
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
