import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { productService } from '../../services/productService'
import './Search.css'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const initial = useMemo(() => ({
    q: searchParams.get('q') || '',
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    capacity: searchParams.get('capacity') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  }), [searchParams])

  const [filters, setFilters] = useState(initial)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await productService.getProducts(filters)
        setProducts(data)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [filters])

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    const params = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v) })
    setSearchParams(params)
  }

  return (
    <div className="search-page form-page-bg">
      <div className="container">
        <section className="advanced-search-card">
          <div className="advanced-search-header">
            <div>
              <p className="advanced-search-label">Tìm kiếm nâng cao</p>
              <h1>Chọn thông số theo ý bạn</h1>
              <span className="advanced-search-desc">
                Điều chỉnh bộ lọc để tìm chính xác dòng sản phẩm bạn cần.
              </span>
            </div>
          </div>

          <div className="advanced-search-grid">
            <div className="filter-group full-width">
              <label>Từ khoá</label>
              <input
                value={filters.q}
                onChange={(e) => updateFilter('q', e.target.value)}
                placeholder="Nhập tên sản phẩm, series..."
              />
            </div>

            <div className="filter-group">
              <label>Hãng</label>
              <select
                value={filters.brand}
                onChange={(e) => updateFilter('brand', e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="apple">Apple</option>
                <option value="samsung">Samsung</option>
                <option value="xiaomi">Xiaomi</option>
                <option value="oppo">OPPO</option>
                <option value="realme">Realme</option>
                <option value="vivo">Vivo</option>
                <option value="huawei">Huawei</option>
                <option value="nokia">Nokia</option>
                <option value="redmi">Redmi</option>
                <option value="pixel">Pixel</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Loại</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="phone">Điện thoại</option>
                <option value="tablet">Máy tính bảng</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Dung lượng</label>
              <select
                value={filters.capacity}
                onChange={(e) => updateFilter('capacity', e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Giá từ</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                placeholder="VNĐ"
              />
            </div>
            <div className="filter-group">
              <label>Đến</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                placeholder="VNĐ"
              />
            </div>
          </div>
        </section>

        <section className="search-results">
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : products.length === 0 ? (
            <div className="empty">Không tìm thấy sản phẩm phù hợp</div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Search


