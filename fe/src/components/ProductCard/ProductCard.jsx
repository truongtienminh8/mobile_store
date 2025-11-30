import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useToast } from '../../contexts/ToastContext'
import { formatPrice } from '../../utils/formatPrice'
import { resolveAssetUrl } from '../../utils/resolveAssetUrl'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { show } = useToast()

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product, 1)
    show('Đã thêm vào giỏ hàng', 'success')
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-image">
          <img src={resolveAssetUrl(product.image || '/placeholder-phone.jpg')} alt={product.name} />
          {product.discount && (
            <span className="discount-badge">-{product.discount}%</span>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">
            {product.originalPrice && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="current-price">{formatPrice(product.price)}</span>
          </div>
          <div className="product-features">
            {product.ram && <span>{product.ram}GB RAM</span>}
            {product.storage && <span>{product.storage}GB</span>}
          </div>
        </div>
      </Link>
      <button className="btn btn-primary" onClick={handleAddToCart}>
        Thêm vào giỏ
      </button>
    </div>
  )
}

export default ProductCard