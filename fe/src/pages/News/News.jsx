import { useEffect, useState } from 'react'
import { newsService } from '../../services/newsService'
import { NewsSkeleton } from '../../components/Skeleton/Skeleton'
import { resolveAssetUrl } from '../../utils/resolveAssetUrl'
import './News.css'

const PAGE_LIMIT = 6

const News = () => {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const load = async (p) => {
    setLoading(true)
    try {
      const res = await newsService.list({ page: p, limit: PAGE_LIMIT })
      setItems(res.data || [])
      setTotalPages(res.pagination?.totalPages || 1)
      setPage(res.pagination?.page || p)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
  }, [])

  return (
    <div className="news-page">
      <div className="container">
        <div className="news-header">
          <h1>Tin tức</h1>
        </div>

        {loading ? (
          <div className="news-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="news-grid">
            {items.map((n) => (
              <article className="news-card" key={n.id}>
                <div className="news-thumb">
                  <a href={`/news/${n.id}`}>
                    <img src={resolveAssetUrl(n.image)} alt={n.title} />
                  </a>
                </div>
                <div className="news-body">
                  <h3 className="news-title">
                    <a href={`/news/${n.id}`}>{n.title}</a>
                  </h3>
                  <p className="news-excerpt">{n.excerpt}</p>
                  <div className="news-meta">
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="pagination">
          <button
            className={`btn ${page === 1 ? 'btn-primary' : ''}`}
            onClick={() => load(1)}
            disabled={page === 1}
          >
            1
          </button>
          {totalPages >= 2 && (
            <button
              className={`btn ${page === 2 ? 'btn-primary' : ''}`}
              onClick={() => load(2)}
              disabled={page === 2}
            >
              2
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default News
