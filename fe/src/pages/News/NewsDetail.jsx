import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { newsService } from '../../services/newsService'
import { absolutizeHtmlImageSrc, resolveAssetUrl } from '../../utils/resolveAssetUrl'
import './NewsDetail.css'

const NewsDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await newsService.getById(id)
        setPost(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="loading">Đang tải...</div>
  if (!post) return <div className="error">Bài viết không tồn tại</div>

  return (
    <div className="news-detail-page">
      <div className="container">
        <h1 className="news-detail-title">{post.title}</h1>
        <div className="news-detail-meta">
          {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}
        </div>
        {post.image && (
          <div className="news-detail-cover">
            <img src={resolveAssetUrl(post.image)} alt={post.title} />
          </div>
        )}
        <div
          className="news-detail-content"
          dangerouslySetInnerHTML={{ __html: absolutizeHtmlImageSrc(post.content) }}
        />
      </div>
    </div>
  )
}

export default NewsDetail


