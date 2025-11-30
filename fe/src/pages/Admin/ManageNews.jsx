import { useEffect, useState } from 'react'
import { newsService } from '../../services/newsService'
import { useToast } from '../../contexts/ToastContext'
import './ManageNews.css'

const initialForm = {
  id: null,
  title: '',
  excerpt: '',
  image: '',
  content: '',
  publishedAt: '',
}

const ManageNews = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(initialForm)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { show } = useToast()

  const limit = 6

  const fetchNews = async (targetPage = page) => {
    setLoading(true)
    setError('')
    try {
      const res = await newsService.list({ page: targetPage, limit })
      setItems(res.data || [])
      setPage(res.pagination?.page || targetPage)
      setTotalPages(res.pagination?.totalPages || 1)
    } catch (err) {
      console.error(err)
      setError('Không tải được danh sách tin tức')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (page !== 1) fetchNews(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const resetForm = () => setForm(initialForm)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt || null,
      image: form.image || null,
      content: form.content || null,
      publishedAt: form.publishedAt || null,
    }

    try {
      if (form.id) {
        const updated = await newsService.update(form.id, payload)
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        show('Cập nhật bài viết thành công', 'success')
      } else {
        const created = await newsService.create(payload)
        setItems((prev) => [created, ...prev])
        show('Thêm bài viết thành công', 'success')
      }
      resetForm()
      fetchNews(1)
    } catch (err) {
      console.error(err)
      setError('Lưu bài viết thất bại')
      show('Lưu bài viết thất bại', 'error')
    } finally {
      setLoading(false)
    }
  }

  const onEdit = (post) => {
    setForm({
      id: post.id,
      title: post.title || '',
      excerpt: post.excerpt || '',
      image: post.image || '',
      content: post.content || '',
      publishedAt: post.publishedAt ? post.publishedAt.slice(0, 16) : '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xoá bài viết này?')) return
    setLoading(true)
    try {
      await newsService.remove(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
      show('Đã xoá bài viết', 'success')
      fetchNews(page)
    } catch (err) {
      console.error(err)
      setError('Xoá bài viết thất bại')
      show('Xoá bài viết thất bại', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-news-page">
      <div className="page-header">
        <h1>Quản lý tin tức</h1>
        <button className="btn btn-secondary" onClick={resetForm} disabled={loading}>
          Tạo mới
        </button>
      </div>

      <div className="news-form-card">
        <h2>{form.id ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={onSubmit} className="news-form">
          <div className="form-group">
            <label>Tiêu đề *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mô tả ngắn</label>
            <textarea
              name="excerpt"
              rows="2"
              value={form.excerpt}
              onChange={onChange}
              placeholder="Tóm tắt nội dung"
            />
          </div>
          <div className="form-group">
            <label>Ảnh đại diện</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={onChange}
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label>Nội dung (HTML)</label>
            <textarea
              name="content"
              rows="4"
              value={form.content}
              onChange={onChange}
              placeholder="<p>Nội dung...</p>"
            />
          </div>
          <div className="form-group">
            <label>Ngày xuất bản</label>
            <input
              type="datetime-local"
              name="publishedAt"
              value={form.publishedAt}
              onChange={onChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {form.id ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {form.id && (
              <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
                Huỷ
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="news-table-card">
        <h2>Danh sách bài viết</h2>
        {loading && items.length === 0 ? (
          <div>Đang tải...</div>
        ) : items.length === 0 ? (
          <div>Chưa có bài viết.</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề</th>
                  <th>Ngày xuất bản</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((post) => (
                  <tr key={post.id}>
                    <td>#{post.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{post.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{post.excerpt}</div>
                    </td>
                    <td>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleString('vi-VN')
                        : 'Chưa công bố'}
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn" onClick={() => onEdit(post)}>
                        Sửa
                      </button>
                      <button className="btn btn-danger" onClick={() => onDelete(post.id)}>
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination" style={{ justifyContent: 'center', marginTop: 16 }}>
            <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
              <button
                key={p}
                className={`btn ${p === page ? 'btn-primary' : ''}`}
                onClick={() => setPage(p)}
                disabled={p === page}
              >
                {p}
              </button>
            ))}
            <button
              className="btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageNews
