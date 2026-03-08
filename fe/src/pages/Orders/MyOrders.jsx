import React, { useState, useEffect } from 'react';
import './MyOrders.css';  // Nếu có CSS

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Sử dụng URL đầy đủ để tránh proxy issue; thay port nếu backend khác
        const response = await fetch('http://localhost:8080/api/orders');  // Hoặc '/api/orders' nếu proxy setup
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Lỗi fetch:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);  // Chạy một lần khi mount

  if (loading) return <div>Đang tải đơn hàng...</div>;
  if (error) return <div>Lỗi: {error}. Vui lòng thử lại sau hoặc kiểm tra kết nối backend.</div>;

  return (
    <div className="my-orders">
      <h1>Đơn hàng của tôi</h1>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Sản phẩm</th>
              <th>Trạng thái</th>
              <th>Hình ảnh</th>  // Nếu có
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.productName}</td>  // Thay bằng field thực tế
                <td>{order.status}</td>
                <td>
                  <img 
                    src={order.image || 'https://via.placeholder.com/400x250?text=No+Image'}  // Sửa placeholder
                    alt="Order Image" 
                    style={{ width: '100px' }} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Error'; }}  // Fallback
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyOrders;