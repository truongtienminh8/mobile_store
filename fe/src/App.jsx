import { Routes, Route } from 'react-router-dom'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Trang người dùng
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import News from './pages/News/News'
import NewsDetail from './pages/News/NewsDetail'
import ProductsDetail from './pages/ProductsDetail/ProductsDetail'
import SearchPage from './pages/Search/Search'
import Carts from './pages/Carts/Carts'
import Checkout from './pages/Checkout/Checkout'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import About from './pages/About/About'

// Trang admin
import Dashboard from './pages/Admin/Dashboard'
import ManageProducts from './pages/Admin/ManageProducts'
import ManageUsers from './pages/Admin/ManageUsers'
import ManageCarts from './pages/Admin/ManageCarts'
import ManageOrders from './pages/Admin/ManageOrders'
import ManageInventory from './pages/Admin/ManageInventory'
import ManageNews from './pages/Admin/ManageNews'
import Reports from './pages/Admin/Reports'
import ManageReviews from './pages/Admin/ManageReviews'

function App() {
  return (
    <Routes>
      {/* ---------- Giao diện người dùng ---------- */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductsDetail />} />
        <Route path="news" element={<News />} />
        <Route path="news/:id" element={<NewsDetail />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="cart" element={<Carts />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<About />} />
      </Route>

      {/* ---------- Khu vực quản trị ---------- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="carts" element={<ManageCarts />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="inventory" element={<ManageInventory />} />
        <Route path="news" element={<ManageNews />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reviews" element={<ManageReviews />} />
      </Route>
    </Routes>
  )
}

export default App
