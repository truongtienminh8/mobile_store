import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { productService } from '../../services/productService'
import { reviewService } from '../../services/reviewService'
import { useToast } from '../../contexts/ToastContext'
import { resolveAssetUrl, absolutizeHtmlImageSrc } from '../../utils/resolveAssetUrl'
import { formatPrice } from '../../utils/formatPrice'
import './ProductDetail.css'
import { ProductDetailSkeleton, ReviewsSkeleton } from '../../components/Skeleton/Skeleton'

const ProductsDetail = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState([])
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    comment: '',
  })
  const { show } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id)
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return
      setReviewLoading(true)
      setReviewError('')
      try {
        const data = await reviewService.list({ productId: id })
        setReviews(data)
      } catch (e) {
        setReviewError('Không tải được đánh giá')
      } finally {
        setReviewLoading(false)
      }
    }
    fetchReviews()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      show('Đã thêm vào giỏ hàng', 'success')
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!id) return
    setReviewLoading(true)
    setReviewError('')
    try {
      const created = await reviewService.create({
        productId: Number(id),
        userName: reviewForm.userName,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      })
      setReviews((prev) => [created, ...prev])
      setReviewForm({ userName: '', rating: 5, comment: '' })
      show('Gửi đánh giá thành công', 'success')
    } catch (e) {
      setReviewError('Gửi đánh giá thất bại')
      show('Gửi đánh giá thất bại', 'error')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) return (
    <div className="product-detail">
      <div className="container">
        <ProductDetailSkeleton />
        <div className="product-description" style={{ marginTop: 16 }}>
          <h2>Mô tả sản phẩm</h2>
          <div className="skeleton-line shimmer" style={{ height: 16 }} />
          <div className="skeleton-line shimmer" style={{ height: 16, width: '80%', marginTop: 6 }} />
        </div>
        <div className="product-reviews" style={{ marginTop: 16 }}>
          <h2>Đánh giá sản phẩm</h2>
          <ReviewsSkeleton />
        </div>
      </div>
    </div>
  )
  if (!product) return <div className="error">Không tìm thấy sản phẩm</div>

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={resolveAssetUrl(product.images?.[selectedImage] || product.image)}
                alt={product.name}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={resolveAssetUrl(img)}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating">
              ⭐⭐⭐⭐⭐ (4.5) | 123 đánh giá
            </div>
            <div className="product-price-section">
              {product.originalPrice && (
                <span className="original-price">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.discount && (
                <span className="discount-badge">-{product.discount}%</span>
              )}
            </div>

            <div className="product-specs">
              <h3>Thông số kỹ thuật</h3>
              <ul>
                {product.ram && <li>RAM: {product.ram}GB</li>}
                {product.storage && <li>Bộ nhớ: {product.storage}GB</li>}
                {product.screen && <li>Màn hình: {product.screen}</li>}
                {product.camera && <li>Camera: {product.camera}</li>}
                {product.battery && <li>Pin: {product.battery}</li>}
                {product.os && <li>Hệ điều hành: {product.os}</li>}
              </ul>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className="btn btn-primary btn-add-to-cart" onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </button>
              <button className="btn btn-buy-now">Mua ngay</button>
            </div>

            <div className="product-policies">
              <div className="policy-item">
                <strong>✓</strong> Chính hãng, bảo hành đầy đủ
              </div>
              <div className="policy-item">
                <strong>✓</strong> Giao hàng miễn phí cho đơn trên 300k
              </div>
              <div className="policy-item">
                <strong>✓</strong> Đổi trả trong 7 ngày
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="product-description">
          <h2>Mô tả sản phẩm</h2>
          <div dangerouslySetInnerHTML={{ __html: absolutizeHtmlImageSrc(product.description) }} />
        </div>

        {/* Product Reviews */}
        <div className="product-reviews">
          <h2>Đánh giá sản phẩm</h2>

          <div className="review-form-card">
            <h3>Viết đánh giá của bạn</h3>
            {reviewError && <div className="error-message">{reviewError}</div>}
            <form onSubmit={submitReview}>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ tên</label>
                  <input
                    type="text"
                    value={reviewForm.userName}
                    onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Đánh giá</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                    required
                  >
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Nhận xét</label>
                <textarea
                  rows="3"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm"
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={reviewLoading}>
                Gửi đánh giá
              </button>
            </form>
          </div>

          <div className="reviews-list-card">
            <h3>Danh sách đánh giá</h3>
            {reviewLoading && reviews.length === 0 ? (
              <div>Đang tải đánh giá...</div>
            ) : reviews.length === 0 ? (
              <div>Chưa có đánh giá nào.</div>
            ) : (
              <ul className="reviews-list">
                {reviews.map((r) => (
                  <li key={r.id} className="review-item">
                    <div className="review-header">
                      <strong>{r.userName || r.user_name}</strong>
                      <span className="review-rating">{"⭐".repeat(r.rating || 0)}</span>
                    </div>
                    {r.comment && <div className="review-comment">{r.comment}</div>}
                    <div className="review-meta">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString()
                        : r.createdAt
                        ? new Date(r.createdAt).toLocaleString()
                        : ''}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsDetail