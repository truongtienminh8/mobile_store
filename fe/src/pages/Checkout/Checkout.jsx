import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { formatPrice } from '../../utils/formatPrice'
import './Checkout.css'

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    paymentMethod: 'cod',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Xử lý đặt hàng
    show('Đặt hàng thành công!', 'success')
    clearCart()
    navigate('/')
  }

  const total = getCartTotal() + (getCartTotal() >= 300000 ? 0 : 30000)

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Thanh toán</h1>
        <div className="checkout-content">
          <div className="checkout-form">
            <h2>Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Họ tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Phương thức thanh toán</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="cod">Thanh toán khi nhận hàng</option>
                  <option value="bank">Chuyển khoản</option>
                  <option value="vnpay">VNPay</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Đặt hàng
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h2>Đơn hàng</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="checkout-total">
              <span>Tổng cộng:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout