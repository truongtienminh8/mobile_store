import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { userService } from '../../services/userService'
import './ManageUsers.css'

const ManageUsers = () => {
  const { user } = useAuth()
  const toast = (() => {
    try {
      return useToast()
    } catch {
      return { show: () => {} }
    }
  })()

  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  })

  const canAccess = useMemo(() => user?.role === 'admin', [user?.role])

  const fetchUsers = async (page = 1) => {
    if (!canAccess) return
    setLoading(true)
    try {
      const { data } = await userService.search({
        q: query.trim() || undefined,
        role: roleFilter || undefined,
        page,
        limit: pagination.limit,
      })
      const list = data.data || data
      setItems(list)
      if (data.pagination) {
        setPagination(data.pagination)
      }
    } catch (error) {
      toast.show(error.response?.data?.message || 'Không tải được danh sách', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess])

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchUsers(1)
  }

  const handleToggleRole = async (target) => {
    const nextRole = target.role === 'admin' ? 'customer' : 'admin'
    if (target.id === user?.id && nextRole !== 'admin') {
      toast.show('Không thể tự hạ quyền của bạn.', 'warning')
      return
    }

    try {
      const { data } = await userService.updateRole(target.id, nextRole)
      const updated = data.data || data
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      toast.show(
        nextRole === 'admin' ? 'Đã cấp quyền admin' : 'Đã hạ quyền về người dùng',
        'success',
      )
    } catch (error) {
      toast.show(error.response?.data?.message || 'Không thể cập nhật quyền', 'error')
    }
  }

  const handlePageChange = (direction) => {
    const nextPage =
      direction === 'prev' ? Math.max(1, pagination.page - 1) : Math.min(pagination.totalPages, pagination.page + 1)
    if (nextPage !== pagination.page) {
      fetchUsers(nextPage)
    }
  }

  if (!canAccess) {
    return (
      <div className="admin-guard">
        <h2>Bạn cần quyền quản trị</h2>
        <p>Đăng nhập bằng tài khoản admin để xem và chỉnh sửa thông tin người dùng.</p>
      </div>
    )
  }

  return (
    <div className="manage-users">
      <header className="manage-users__header">
        <div>
          <p className="eyebrow">Quản lý tài khoản</p>
          <h1>Danh sách người dùng</h1>
          <span>Tra cứu và cấp quyền admin cho bất kỳ tài khoản nào.</span>
        </div>
      </header>

      <form className="user-filters" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tìm theo tên, email hoặc số điện thoại..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">Tất cả vai trò</option>
          <option value="customer">Khách hàng</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>

      <div className="users-table">
        <div className="users-table__head">
          <span>Người dùng</span>
          <span>Email</span>
          <span>Vai trò</span>
          <span>Thao tác</span>
        </div>
        {loading ? (
          <div className="users-table__empty">Đang tải danh sách...</div>
        ) : items.length === 0 ? (
          <div className="users-table__empty">Không có người dùng phù hợp</div>
        ) : (
          items.map((item) => (
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
          ))
        )}
      </div>

      <div className="users-pagination">
        <button type="button" disabled={pagination.page <= 1 || loading} onClick={() => handlePageChange('prev')}>
          Trước
        </button>
        <span>
          Trang {pagination.page} / {pagination.totalPages || 1}
        </span>
        <button
          type="button"
          disabled={pagination.page >= pagination.totalPages || loading}
          onClick={() => handlePageChange('next')}
        >
          Sau
        </button>
      </div>
    </div>
  )
}

export default ManageUsers
