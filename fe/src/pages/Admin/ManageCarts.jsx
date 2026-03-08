import React, { useState, useEffect } from 'react';
import './ManageCarts.css';
// 1. Dữ liệu giả lập (Sau này sẽ thay bằng gọi API từ backend)
const MOCK_DATA = [
  { id: 101, username: 'nguyenvana', itemCount: 3, total: 15000000, updated_at: '2023-10-25 08:30' },
  { id: 102, username: 'tranvanb', itemCount: 0, total: 0, updated_at: '2023-10-26 09:15' }, // Giỏ rỗng
  { id: 103, username: 'lethic', itemCount: 1, total: 5000000, updated_at: '2023-10-27 10:00' },
  { id: 104, username: 'guest_user', itemCount: 0, total: 0, updated_at: '2023-10-28 11:20' }, // Giỏ rỗng
  { id: 105, username: 'hoangvand', itemCount: 5, total: 45000000, updated_at: '2023-10-28 14:45' },
];

const ManageCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Hàm lấy dữ liệu (Giả lập gọi API)
  const fetchCarts = () => {
    setLoading(true);
    // Giả lập độ trễ mạng 0.5s
    setTimeout(() => {
      setCarts(MOCK_DATA);
      setLoading(false);
    }, 500);
  };

  // Gọi dữ liệu khi component vừa hiện lên
  useEffect(() => {
    fetchCarts();
  }, []);

  // 3. Xử lý nút Làm mới
  const handleRefresh = () => {
    fetchCarts();
  };

  // 4. Xử lý nút Xoá giỏ trống
  const handleDeleteEmpty = () => {
    if (window.confirm('Bạn có chắc muốn xoá tất cả các giỏ hàng đang trống (0 sản phẩm)?')) {
      // Logic lọc: Chỉ giữ lại những giỏ có itemCount > 0
      const activeCarts = carts.filter(cart => cart.itemCount > 0);
      setCarts(activeCarts);
      alert('Đã dọn dẹp các giỏ hàng rỗng!');
      
      // *Lưu ý: Khi ghép API thật, đoạn này bạn sẽ gọi:
      // await api.deleteEmptyCarts();
      // fetchCarts();
    }
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="manage-carts" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', color: '#333' }}>Quản lý giỏ hàng</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleRefresh} className="btn" style={{ cursor: 'pointer', padding: '8px 15px' }}>
            {loading ? 'Đang tải...' : '🔄 Làm mới'}
          </button>
          <button 
            onClick={handleDeleteEmpty} 
            className="btn btn-danger" 
            style={{ cursor: 'pointer', padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            🗑️ Xoá giỏ trống
          </button>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={thStyle}>ID Giỏ</th>
                <th style={thStyle}>Người dùng</th>
                <th style={thStyle}>Số lượng SP</th>
                <th style={thStyle}>Tổng giá trị</th>
                <th style={thStyle}>Cập nhật cuối</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {carts.length > 0 ? (
                carts.map((cart) => (
                  <tr key={cart.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>#{cart.id}</td>
                    <td style={tdStyle}><strong>{cart.username}</strong></td>
                    <td style={tdStyle}>{cart.itemCount}</td>
                    <td style={tdStyle}>{formatCurrency(cart.total)}</td>
                    <td style={tdStyle}>{cart.updated_at}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        backgroundColor: cart.itemCount > 0 ? '#d4edda' : '#f8d7da',
                        color: cart.itemCount > 0 ? '#155724' : '#721c24'
                      }}>
                        {cart.itemCount > 0 ? 'Đang mua sắm' : 'Giỏ rỗng'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Không có giỏ hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// CSS inline đơn giản cho Table
const thStyle = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#495057'
};

const tdStyle = {
  padding: '12px',
  color: '#212529'
};

export default ManageCarts;