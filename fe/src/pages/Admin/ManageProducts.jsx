import { useEffect, useMemo, useState } from 'react'
import { productService } from '../../services/productService'
import { useToast } from '../../contexts/ToastContext'
import './ManageProducts.css'

const emptyForm = {
  id: null,
  name: '',
  price: '',
  originalPrice: '',
  discount: 0,
  image: '', // Dùng URL string
  brand: '',
  category: '',
  ram: '',
  storage: '',
  screen: '',
  camera: '',
  battery: '',
  os: '',
  description: '',
  isFeatured: false,
}

const ManageProducts = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const { show } = useToast()

  const limit = 10

  const filters = useMemo(() => {
    const query = {}
    if (search) query.q = search
    if (categoryFilter) query.category = categoryFilter
    if (brandFilter) query.brand = brandFilter
    return query
  }, [search, categoryFilter, brandFilter])

  const fetchProducts = async (resetPage = false) => {
    setLoading(true)
    setError('')
    try {
      const targetPage = resetPage ? 1 : page
      const { items: data, pagination } = await productService.getProductsWithPagination({
        ...filters,
        page: targetPage,
        limit,
      })
      setItems(data || [])
      setTotalPages(pagination?.totalPages || 1)
      setPage(pagination?.page || targetPage)
    } catch (err) {
      console.error(err)
      setError('Không tải được danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters])

  const resetForm = () => setForm(emptyForm)

  // --- XỬ LÝ NHẬP LIỆU & TÍNH TOÁN GIÁ ---
  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = type === 'checkbox' ? checked : value

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: newValue }

      // Logic tính toán giá tự động
      if (['price', 'originalPrice', 'discount'].includes(name)) {
        let price = Number(updatedForm.price)
        let originalPrice = Number(updatedForm.originalPrice)
        let discount = Number(updatedForm.discount)
        const inputValue = Number(newValue)

        if (name === 'originalPrice') {
          originalPrice = inputValue
          if (discount > 0) {
            price = originalPrice * (1 - discount / 100)
          } else if (price > 0 && price < originalPrice) {
            discount = ((originalPrice - price) / originalPrice) * 100
          }
        } else if (name === 'discount') {
          discount = inputValue
          if (originalPrice > 0) {
            price = originalPrice * (1 - discount / 100)
          } else if (price > 0 && discount < 100) {
            originalPrice = price / (1 - discount / 100)
          }
        } else if (name === 'price') {
          price = inputValue
          if (originalPrice > 0) {
            if (price <= originalPrice) {
              discount = ((originalPrice - price) / originalPrice) * 100
            } else {
              discount = 0
            }
          } else if (discount > 0 && discount < 100) {
            originalPrice = price / (1 - discount / 100)
          }
        }

        updatedForm.price = price > 0 ? Math.round(price) : ''
        updatedForm.originalPrice = originalPrice > 0 ? Math.round(originalPrice) : ''
        updatedForm.discount = discount > 0 ? parseFloat(discount.toFixed(2)) : 0
      }

      return updatedForm
    })
  }

  const preparePayload = () => {
    return {
      name: form.name.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      discount: form.discount ? Number(form.discount) : 0,
      image: form.image || null, // Gửi link ảnh
      images: [], // Gửi mảng rỗng để fix lỗi backend
      brand: form.brand || null,
      category: form.category || null,
      ram: form.ram || null,
      storage: form.storage || null,
      screen: form.screen || null,
      camera: form.camera || null,
      battery: form.battery || null,
      os: form.os || null,
      description: form.description || null,
      isFeatured: form.isFeatured,
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = preparePayload()
      if (form.id) {
        const updated = await productService.update(form.id, payload)
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        show('Cập nhật sản phẩm thành công', 'success')
      } else {
        const created = await productService.create(payload)
        if (page !== 1) {
          setPage(1)
        } else {
          setItems((prev) => [created, ...prev].slice(0, limit))
        }
        show('Thêm sản phẩm thành công', 'success')
      }
      resetForm()
      fetchProducts(true)
    } catch (err) {
      console.error(err)
      if (err.response && err.response.data && err.response.data.message) {
        setError('Lỗi: ' + err.response.data.message)
      } else {
        setError('Lưu sản phẩm thất bại')
      }
      show('Lưu sản phẩm thất bại', 'error')
    } finally {
      setLoading(false)
    }
  }

  const onEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      discount: product.discount || 0,
      image: product.image || '',
      brand: product.brand || '',
      category: product.category || '',
      ram: product.ram || '',
      storage: product.storage || '',
      screen: product.screen || '',
      camera: product.camera || '',
      battery: product.battery || '',
      os: product.os || '',
      description: product.description || '',
      isFeatured: !!product.isFeatured,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xoá sản phẩm này?')) return
    setLoading(true)
    try {
      await productService.remove(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
      show('Đã xoá sản phẩm', 'success')
      fetchProducts()
    } catch (err) {
      console.error(err)
      setError('Xoá sản phẩm thất bại')
      show('Xoá sản phẩm thất bại', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-products-page">
      <div className="page-header">
        <h1>Quản lý sản phẩm</h1>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchProducts(true)
          }}
        />
        <input
          type="text"
          placeholder="Lọc theo category..."
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lọc theo brand..."
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        />
        <button className="btn" onClick={() => fetchProducts(true)} disabled={loading}>
          Áp dụng
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setSearch('')
            setCategoryFilter('')
            setBrandFilter('')
            setPage(1)
          }}
          disabled={loading}
        >
          Xoá lọc
        </button>
      </div>

      <div className="product-form-card">
        <h2>{form.id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={onSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tên sản phẩm *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Giá Bán (Sau giảm) *</label>
              <input
                type="number"
                name="price"
                min="0"
                value={form.price}
                onChange={onChange}
                required
                placeholder="Nhập giá bán..."
              />
            </div>
            <div className="form-group">
              <label>Giá gốc (Trước giảm)</label>
              <input
                type="number"
                name="originalPrice"
                min="0"
                value={form.originalPrice}
                onChange={onChange}
                placeholder="Nhập giá gốc..."
              />
            </div>
            <div className="form-group">
              <label>Giảm giá (%)</label>
              <input
                type="number"
                name="discount"
                min="0"
                max="100"
                value={form.discount}
                onChange={onChange}
                placeholder="Nhập %..."
              />
            </div>
          </div>

          <div className="form-row">
            {/* NHẬP URL ẢNH */}
            <div className="form-group">
              <label>Link Ảnh đại diện (URL)</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={onChange}
                placeholder="https://example.com/anh-san-pham.jpg"
              />
              {/* Hiển thị xem trước ảnh */}
              {form.image && (
                <div className="image-preview-container">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="image-preview"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Thương hiệu</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={onChange}
                placeholder="apple, samsung..."
              />
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={onChange}
                placeholder="phone, laptop..."
              />
            </div>
            <div className="form-group">
              <label>RAM</label>
              <input
                type="text"
                name="ram"
                value={form.ram}
                onChange={onChange}
                placeholder="8GB"
              />
            </div>
            <div className="form-group">
              <label>Bộ nhớ</label>
              <input
                type="text"
                name="storage"
                value={form.storage}
                onChange={onChange}
                placeholder="256GB"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Màn hình</label>
              <input
                type="text"
                name="screen"
                value={form.screen}
                onChange={onChange}
                placeholder='6.7" OLED...'
              />
            </div>
            <div className="form-group">
              <label>Camera</label>
              <input
                type="text"
                name="camera"
                value={form.camera}
                onChange={onChange}
                placeholder="48MP + 12MP + ..."
              />
            </div>
            <div className="form-group">
              <label>Pin</label>
              <input
                type="text"
                name="battery"
                value={form.battery}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label>Hệ điều hành</label>
              <input type="text" name="os" value={form.os} onChange={onChange} placeholder="iOS 18" />
            </div>
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={onChange}
              placeholder="HTML mô tả sản phẩm"
            />
          </div>

          <div className="form-row" style={{ alignItems: 'center', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={onChange}
              />
              Sản phẩm nổi bật
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {form.id ? 'Cập nhật' : 'Thêm sản phẩm'}
            </button>
            {form.id && (
              <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
                Huỷ
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="products-table-card">
        <h2>Danh sách sản phẩm</h2>
        {loading && items.length === 0 ? (
          <div>Đang tải...</div>
        ) : items.length === 0 ? (
          <div>Chưa có sản phẩm phù hợp.</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Danh mục</th>
                  <th>Nổi bật</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((product) => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="table-thumbnail"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                        />
                      ) : (
                        <div className="table-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                           📷
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{product.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{product.ram} {product.storage}</div>
                    </td>
                    <td>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0,
                      }).format(product.price || 0)}
                    </td>
                    <td>{product.category || '-'}</td>
                    <td>{product.isFeatured ? '✔️' : ''}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn" onClick={() => onEdit(product)}>
                        Sửa
                      </button>
                      <button className="btn btn-danger" onClick={() => onDelete(product.id)}>
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

export default ManageProducts