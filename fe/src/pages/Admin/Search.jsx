import { useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { productService } from '../../services/productService'
import { userService } from '../../services/userService'
import './Search.css'

const Search = () => {
  const { user } = useAuth()
  const toast = (() => {
    try {
      return useToast()
    } catch {
      return { show: () => {} }
    }
  })()

  const canAccess = useMemo(() => user?.role === 'admin', [user?.role])
  const [searchType, setSearchType] = useState('products')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])

  const handleSearch = async (event) => {
    event.preventDefault()
    if (!query.trim()) {
      toast.show('Nhập từ khoá để tìm kiếm', 'info')
      return
    }
    if (!canAccess) return

    setLoading(true)
    try {
      if (searchType === 'products') {
        const data = await productService.getProducts({ q: query.trim(), limit: 20 })
        const items = Array.isArray(data) ? data : data?.data || []
        setProducts(items)
        setUsers([])
        if (!items.length) {
          toast.show('Không tìm thấy sản phẩm phù hợp', 'info')
        }
      } else {
        const { data } = await userService.search({ q: query.trim(), limit: 20 })
        const items = data?.data || data || []
        setUsers(items)
        setProducts([])
        if (!items.length) {
          toast.show('Không tìm thấy người dùng phù hợp', 'info')
        }
      }
    } catch (error) {
      toast.show(error.response?.data?.message || 'Tìm kiếm thất bại', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRole = async (target) => {
    const nextRole = target.role === 'admin' ? 'customer' : 'admin'
    if (target.id === user?.id && nextRole !== 'admin') {
      toast.show('Không thể tự hạ quyền của bạn.', 'warning')
      return
    }

    try {
      const { data } = await userService.updateRole(target.id, nextRole)
      const updated = data?.data || data
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      toast.show(
        nextRole === 'admin' ? 'Đã cấp quyền admin' : 'Đã gỡ quyền admin',
        'success',
      )
    } catch (error) {
      toast.show(error.response?.data?.message || 'Không thể cập nhật quyền', 'error')
    }
  }

  if (!canAccess) {
    return (
      <div className="admin-guard">
        <h2>Bạn cần quyền quản trị</h2>
        <p>Đăng nhập bằng tài khoản admin để sử dụng công cụ tìm kiếm nâng cao.</p>
      </div>
    )
  }

  return (
    <div className="admin-search">
      <header className="admin-search__header">
        <p className="eyebrow">Tìm kiếm nâng cao</p>
        <h1>Tìm kiếm sản phẩm & người dùng</h1>
        <span>Nhập từ khoá, chọn loại dữ liệu cần tìm và thao tác trực tiếp tại đây.</span>
      </header>

      <form className="admin-search__form" onSubmit={handleSearch}>
        <div className="search-type">
          <button
            type="button"
            className={searchType === 'products' ? 'active' : ''}
            onClick={() => setSearchType('products')}
          >
            Sản phẩm
          </button>
          <button
            type="button"
            className={searchType === 'users' ? 'active' : ''}
            onClick={() => setSearchType('users')}
          >
            Người dùng
          </button>
        </div>
        <input
          type="text"
          placeholder={
            searchType === 'products'
              ? 'Nhập tên sản phẩm, hãng...'
              : 'Nhập tên, email hoặc số điện thoại người dùng...'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>

      <section className="admin-search__results">
        {loading ? (
          <div className="admin-search__empty">Đang tìm kiếm...</div>
        ) : searchType === 'products' ? (
          products.length === 0 ? (
            <div className="admin-search__empty">Nhập từ khoá để bắt đầu tìm sản phẩm.</div>
          ) : (
            <div className="product-results">
              {products.map((item) => (
                <article key={item.id} className="product-card">
                  <div className="product-card__head">
                    <h3>{item.name}</h3>
                    <span className="product-brand">{item.brand}</span>
                  </div>
                  <div className="product-card__body">
                    <p className="product-price">
                      {item.price?.toLocaleString('vi-VN')} đ
                    </p>
                    <p className="product-meta">
                      {item.storage || item.ram ? `${item.storage ?? ''} ${item.ram ?? ''}` : 'Không rõ cấu hình'}
                    </p>
                    <span className="product-id">ID: {item.id}</span>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : users.length === 0 ? (
          <div className="admin-search__empty">Nhập từ khoá để tìm người dùng.</div>
        ) : (
          <div className="users-table">
            <div className="users-table__head">
              <span>Người dùng</span>
              <span>Email</span>
              <span>Vai trò</span>
              <span>Thao tác</span>
            </div>
            {users.map((item) => (
              <div className="users-table__row" key={item.id}>
                <div>
                  <p className="user-name">{item.name}</p>
                  <span className="user-meta">ID: {item.id}</span>
                </div>
                <div>
                  <p>{item.email}</p>
                  {item.phone && <span className="user-meta">{item.phone}</span>}
                </div>
                <div>
                  <span className={`role-badge role-${item.role}`}>{item.role}</span>
                </div>
                <div>
                  <button
                    type="button"
                    className="assign-btn"
                    onClick={() => handleToggleRole(item)}
                  >
                    {item.role === 'admin' ? 'Gỡ quyền admin' : 'Cấp quyền admin'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Search
