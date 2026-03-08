import { Outlet, NavLink, Link } from 'react-router-dom'
// Import các icon từ bộ thư viện 'react-icons/fa'
import { 
  FaBox, 
  FaUser, 
  FaShoppingCart, 
  FaClipboardList, 
  FaWarehouse, 
  FaChartBar, 
  FaNewspaper, 
  FaStar, 
  FaHome 
} from 'react-icons/fa'

// Import file CSS (xem file số 3 bên dưới)
import './AdminLayout.css'

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Dashboard</h2>

        {/* Nút về trang chủ */}
        <div className="home-btn-container">
          <Link to="/" className="admin-home-btn">
            <FaHome /> Về Trang Chủ
          </Link>
        </div>

        {/* Menu chính sử dụng NavLink */}
        <nav>
          {/* NavLink tự động thêm class "active" khi URL trùng khớp */}
          
          <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaBox /> Quản lý sản phẩm
          </NavLink>

          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaUser /> Quản lý tài khoản
          </NavLink>

          <NavLink to="/admin/carts" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaShoppingCart /> Quản lý giỏ hàng
          </NavLink>

          <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaClipboardList /> Quản lý đơn hàng
          </NavLink>

          <NavLink to="/admin/inventory" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaWarehouse /> Quản lý tồn kho
          </NavLink>

          <NavLink to="/admin/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaChartBar /> Báo cáo & Thống kê
          </NavLink>
          
          <NavLink to="/admin/news" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaNewspaper /> Quản lý tin tức
          </NavLink>

          <NavLink to="/admin/reviews" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaStar /> Quản lý đánh giá
          </NavLink>
        </nav>
      </aside>

      {/* Khu vực hiển thị nội dung các trang con (ManageProducts sẽ hiện ở đây) */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout