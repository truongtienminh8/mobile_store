import { useEffect, useMemo, useState } from 'react'
import { reviewService } from '../../services/reviewService'
import { useToast } from '../../contexts/ToastContext'
import './ManageReviews.css'

const initialForm = { id: null, productId: '', userName: '', rating: 5, comment: '' }

const ManageReviews = () => {
  const [reviews, setReviews] = useState([])
  const [filterProductId, setFilterProductId] = useState('')
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { show } = useToast()

  const fetchReviews = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await reviewService.list(
        filterProductId ? { productId: filterProductId } : {},
      )
      
      // --- FIX 1: Kiểm tra dữ liệu trả về có phải mảng không ---
      if (Array.isArray(data)) {
        setReviews(data)
      } else {
        console.warn('API trả về dữ liệu không phải mảng:', data)
        setReviews([]) // Fallback về mảng rỗng để không bị lỗi .map
      }
      
      show('Đã tải danh sách đánh giá', 'info', 1200)
    } catch (e) {
      console.error(e)
      setError('Không tải được danh sách đánh giá')
      setReviews([]) // Đảm bảo reviews luôn là mảng ngay cả khi lỗi
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (form.id) {
        const updated = await reviewService.update(form.id, {
          userName: form.userName,
          rating: Number(form.rating),
          comment: form.comment,
        })
        setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
        show('Cập nhật đánh giá thành công', 'success')
      } else {
        const created = await reviewService.create({
          productId: Number(form.productId),
          userName: form.userName,
          rating: Number(form.rating),
          comment: form.comment,
        })
        setReviews((prev) => [created, ...prev])
        show('Thêm đánh giá thành công', 'success')
      }
      setForm(initialForm)
    } catch (e) {
      setError('Lưu đánh giá thất bại')
      show('Lưu đánh giá thất bại', 'error')
    } finally {
      setLoading(false)
    }
  }

  const onEdit = (review) => {
    setForm({
      id: review.id,
      productId: review.productId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment || '',
    })
  }

  const onDelete = async (id) => {
    if (!confirm('Xoá đánh giá này?')) return
    setLoading(true)
    setError('')
    try {
      await reviewService.remove(id)
      setReviews((prev) => prev.filter((r) => r.id !== id))
      show('Đã xoá đánh giá', 'success')
    } catch (e) {
      setError('Xoá đánh giá thất bại')
      show('Xoá đánh giá thất bại', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredCountText = useMemo(() => {
    return filterProductId ? `(Sản phẩm #${filterProductId})` : ''
  }, [filterProductId, reviews]) // Thêm reviews vào dependencies để update số lượng nếu cần

  return (
    <div className="admin-reviews-page">
      <h1>Quản lý đánh giá {filteredCountText}</h1>

      <div className="reviews-actions">
        <div className="filter-group">
          <label>Mã sản phẩm</label>
          <input
            type="number"
            min="1"
            name="filterProductId"
            value={filterProductId}
            onChange={(e) => setFilterProductId(e.target.value)}
            placeholder="Nhập mã sản phẩm để lọc"
          />
          <button className="btn" onClick={fetchReviews} disabled={loading}>
            Lọc
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFilterProductId('')
              fetchReviews()
            }}
            disabled={loading}
          >
            Xoá lọc
          </button>
        </div>
      </div>

      <div className="review-form-card">
        <h2>{form.id ? 'Cập nhật đánh giá' : 'Thêm đánh giá mới'}</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={onSubmit}>
          {!form.id && (
            <div className="form-group">
              <label>Mã sản phẩm</label>
              <input
                type="number"
                name="productId"
                min="1"
                value={form.productId}
                onChange={onChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Tên người dùng</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Đánh giá (1-5)</label>
            <select name="rating" value={form.rating} onChange={onChange} required>
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option> 
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nhận xét</label>
            <textarea
              name="comment"
              rows="3"
              value={form.comment}
              onChange={onChange}
              placeholder="Viết nhận xét của bạn"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {form.id ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {form.id && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setForm(initialForm)}
              >
                Huỷ
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="reviews-table-card">
        <h2>Danh sách đánh giá</h2>
        <div className="table-responsive">
          <table className="reviews-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            
            {/* --- FIX 2: Render an toàn trong tbody --- */}
            <tbody>
              {Array.isArray(reviews) && reviews.length > 0 ? (
                reviews.map((r) => (
                  <tr key={r.id || Math.random()}> 
                    <td>{r.id}</td>
                    <td>#{r.productId}</td>
                    <td>{r.userName}</td>
                    <td>{r.rating}</td>
                    <td className="comment-cell">{r.comment}</td>
                    <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                    <td>
                      <button className="btn" onClick={() => onEdit(r)}>
                        Sửa
                      </button>
                      <button className="btn btn-danger" onClick={() => onDelete(r.id)}>
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    {loading ? 'Đang tải dữ liệu...' : 'Không có đánh giá nào.'}
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageReviews