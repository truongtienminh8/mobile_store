import './Skeleton.css'

export const ProductSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img shimmer" />
      <div className="skeleton-line shimmer" style={{ width: '80%' }} />
      <div className="skeleton-line shimmer" style={{ width: '60%' }} />
      <div className="skeleton-price shimmer" />
      <div className="skeleton-btn shimmer" />
    </div>
  )
}

export const NewsSkeleton = () => {
  return (
    <div className="skeleton-news-card">
      <div className="skeleton-news-img shimmer" />
      <div className="skeleton-line shimmer" style={{ width: '90%' }} />
      <div className="skeleton-line shimmer" style={{ width: '70%' }} />
    </div>
  )
}

export const ProductDetailSkeleton = () => {
  return (
    <div className="skeleton-detail">
      <div className="skeleton-detail-grid">
        <div className="skeleton-img shimmer" style={{ height: 360 }} />
        <div>
          <div className="skeleton-line shimmer" style={{ width: '70%', height: 22 }} />
          <div className="skeleton-line shimmer" style={{ width: '40%', height: 22, marginTop: 8 }} />
          <div className="skeleton-price shimmer" style={{ width: '30%', height: 28, marginTop: 10 }} />
          <div className="skeleton-line shimmer" style={{ width: '85%', marginTop: 12 }} />
          <div className="skeleton-line shimmer" style={{ width: '60%' }} />
          <div className="skeleton-btn shimmer" style={{ marginTop: 16 }} />
        </div>
      </div>
    </div>
  )
}

export const ReviewsSkeleton = () => {
  return (
    <div className="skeleton-reviews">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton-review-item">
          <div className="skeleton-line shimmer" style={{ width: '30%' }} />
          <div className="skeleton-line shimmer" style={{ width: '80%' }} />
          <div className="skeleton-line shimmer" style={{ width: '60%' }} />
        </div>
      ))}
    </div>
  )
}


