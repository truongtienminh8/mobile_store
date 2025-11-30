import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useToast } from '../../contexts/ToastContext'
import { formatPrice } from '../../utils/formatPrice'
import './Cart.css'

const Carts = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const { show } = useToast()

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link to="/products" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Giỏ hàng của bạn</h1>
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <div className="item-price">{formatPrice(item.price)}</div>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div className="item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Tóm tắt đơn hàng</h2>
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{getCartTotal() >= 300000 ? 'Miễn phí' : '30,000đ'}</span>
            </div>
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>
                {formatPrice(getCartTotal() + (getCartTotal() >= 300000 ? 0 : 30000))}
              </span>
            </div>
            <Link to="/checkout" className="btn btn-primary">
              Thanh toán
            </Link>
            <button
              className="btn"
              style={{ marginTop: 8 }}
              onClick={() => {
                if (confirm('Xoá toàn bộ giỏ hàng?')) {
                  clearCart()
                  show('Đã xoá toàn bộ giỏ hàng', 'success')
                }
              }}
            >
              Xoá giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carts