import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { formatPrice } from '../../utils/formatPrice'
import emailjs from '@emailjs/browser' 
import './Checkout.css'

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '', // Quan trọng để gửi mail
    address: '',
    paymentMethod: 'cod',
  })

  // --- CẤU HÌNH EMAILJS (BẠN ĐIỀN MÃ THẬT VÀO ĐÂY) ---
  const SERVICE_ID = 'service_rbkoc6h';    // Mã mình lấy từ ảnh của bạn
  const TEMPLATE_ID = 'template_wzvbemx';  // <-- ĐIỀN MÃ TEMPLATE ID CỦA BẠN VÀO ĐÂY
  const PUBLIC_KEY = 'CZhV0hQ4ZAjgQF_E5';   // <-- ĐIỀN MÃ PUBLIC KEY CỦA BẠN VÀO ĐÂY
  // ----------------------------------------------------

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 1. Hàm gọi API lưu đơn hàng xuống Database (Java/PHP)
  const saveOrderToDatabase = async (orderPayload) => {
    // Sửa cổng 8080 thành cổng backend thật của bạn nếu khác
    const API_URL = 'http://127.0.0.1:8080/api/orders'; 
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
        throw new Error('Không thể lưu đơn hàng vào hệ thống (Lỗi Backend)');
    }
    return await response.json();
  }

  // 2. Hàm gửi Email qua EmailJS
  const sendOrderEmail = async (totalAmount) => {
    // Tạo danh sách sản phẩm dạng text dễ đọc
    const productList = cartItems.map(item => 
      `- ${item.name} (x${item.quantity}): ${formatPrice(item.price * item.quantity)}`
    ).join('\n');

    const templateParams = {
      to_name: formData.name,
      to_email: formData.email, // Biến này phải khớp với {{to_email}} trên web EmailJS
      phone: formData.phone,
      address: formData.address,
      order_items: productList,
      total_price: formatPrice(totalAmount),
      delivery_note: "Đơn hàng đã được hệ thống ghi nhận và đang chờ xử lý.", 
    };

    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Kiểm tra dữ liệu đầu vào
    if (!user?.id) {
        show('Vui lòng đăng nhập để đặt hàng!', 'error');
        return;
    }
    if (!formData.email) {
        show('Vui lòng nhập email để nhận thông báo đơn hàng!', 'error');
        return;
    }

    setIsSubmitting(true);

    const shippingFee = getCartTotal() >= 300000 ? 0 : 30000;
    const finalTotal = getCartTotal() + shippingFee;

    try {
        // BƯỚC 1: Chuẩn bị dữ liệu
        // Lưu ý: userId phải là số (int) để khớp với Database
        const orderPayload = {
            userId: parseInt(user.id), 
            customerName: formData.name,
            phone: formData.phone,
            address: formData.address,
            totalAmount: finalTotal,
            // Chuyển mảng sản phẩm thành chuỗi JSON để lưu vào cột order_items (TEXT/JSON)
            orderItems: JSON.stringify(cartItems.map(item => ({
                id: item.id,
                name: item.name,
                qty: item.quantity,
                price: item.price
            })))
        };

        // BƯỚC 2: Lưu vào Database trước
        console.log("Đang lưu đơn hàng...", orderPayload);
        await saveOrderToDatabase(orderPayload);

        // BƯỚC 3: Nếu lưu DB thành công thì mới gửi Email
        console.log("Lưu DB thành công. Đang gửi email...");
        await sendOrderEmail(finalTotal);

        // BƯỚC 4: Hoàn tất
        show('Đặt hàng thành công! Vui lòng kiểm tra email.', 'success');
        clearCart();
        navigate('/orders'); // Chuyển sang trang lịch sử đơn hàng

    } catch (error) {
        console.error('Quy trình đặt hàng thất bại:', error);
        
        // Phân loại lỗi để báo cho người dùng
        if (error.text) {
             // Lỗi từ EmailJS thường có thuộc tính .text
             alert(`Lỗi gửi mail: ${JSON.stringify(error.text)}`);
        } else {
             // Lỗi từ Backend hoặc mạng
             alert(`Lỗi đặt hàng: ${error.message}`);
        }
    } finally {
        setIsSubmitting(false);
    }
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
               {/* Ô nhập Email (Bắt buộc) */}
               <div className="form-group">
                <label>Email nhận thông báo (*)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ví dụ: abc@gmail.com"
                  required
                />
              </div>

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
                <label>Địa chỉ nhận hàng</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Số nhà, tên đường, phường/xã..."
                />
              </div>
              <div className="form-group">
                <label>Phương thức thanh toán</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                  <option value="bank">Chuyển khoản ngân hàng</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h2>Đơn hàng của bạn</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <span>{item.name} <strong>x{item.quantity}</strong></span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="checkout-total">
              <span>Tổng cộng:</span>
              <span style={{ color: '#d70018', fontSize: '1.2em' }}>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout