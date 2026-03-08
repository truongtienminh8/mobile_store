import { useState, useEffect } from "react";
import "./ManageOrders.css"; // Đảm bảo bạn đã có file CSS này (tôi để code CSS ở dưới để bạn tiện copy)

const ManageOrders = () => {
  // State lưu trữ dữ liệu từ Server
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State bộ lọc và tìm kiếm
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // --- CẤU HÌNH API ---
  // Bạn thay đổi đường dẫn này thành URL API thực tế của bạn (Backend)
  const API_URL = "http://localhost:8080/api/orders"; 

  // --- 1. HÀM LẤY DỮ LIỆU TỪ SERVER ---
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error("Không thể kết nối đến server (Lỗi tải danh sách)");
      }

      const data = await response.json();
      // Giả sử API trả về mảng đơn hàng. Nếu API trả về object { data: [...] } thì sửa thành data.data
      setOrders(data);
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setError("Không thể tải dữ liệu đơn hàng. Vui lòng kiểm tra kết nối Server.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API ngay khi component được tải
  useEffect(() => {
    fetchOrders();
  }, []);

  // --- 2. HÀM XỬ LÝ TRẠNG THÁI (DUYỆT/TỪ CHỐI) ---
  const handleUpdateStatus = async (id, newStatus) => {
    // Xác nhận trước khi thực hiện
    const actionName = newStatus === "approved" ? "DUYỆT" : "TỪ CHỐI";
    if (!window.confirm(`Bạn có chắc muốn ${actionName} đơn hàng #${id}?`)) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH", // Hoặc PUT tùy vào Backend của bạn quy định
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Cập nhật giao diện ngay lập tức (Optimistic UI update)
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert("Lỗi: Không thể cập nhật trạng thái trên Server.");
      }
    } catch (err) {
      alert("Lỗi kết nối Server.");
    }
  };

  // --- 3. HÀM XÓA ĐƠN HÀNG ---
  const handleDelete = async (id) => {
    if (!window.confirm(`CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn đơn hàng #${id}?`)) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Xóa đơn hàng khỏi danh sách hiển thị
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      } else {
        alert("Lỗi: Không thể xóa đơn hàng này.");
      }
    } catch (err) {
      alert("Lỗi kết nối khi xóa.");
    }
  };

  // --- 4. CÁC HÀM TIỆN ÍCH (FORMAT, FILTER) ---
  
  // Format tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Logic lọc và tìm kiếm
  const filteredOrders = orders.filter((order) => {
    const matchStatus = filterStatus === "all" || order.status === filterStatus;
    
    // Kiểm tra null/undefined để tránh lỗi crash app
    const customerName = order.customerName ? order.customerName.toLowerCase() : "";
    const orderId = order.id ? order.id.toString().toLowerCase() : "";
    
    const matchSearch =
      customerName.includes(searchTerm.toLowerCase()) ||
      orderId.includes(searchTerm.toLowerCase());
      
    return matchStatus && matchSearch;
  });

  // Badge màu sắc cho trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved": return <span className="status-badge approved">Đã duyệt</span>;
      case "rejected": return <span className="status-badge rejected">Đã hủy</span>;
      default: return <span className="status-badge pending">Chờ xử lý</span>;
    }
  };

  // --- 5. RENDER GIAO DIỆN ---

  if (loading) return <div className="manage-orders-loading">Đang tải dữ liệu đơn hàng...</div>;
  if (error) return (
    <div className="manage-orders-error">
      <h3>{error}</h3>
      <button className="btn btn-primary" onClick={fetchOrders}>Thử lại</button>
    </div>
  );

  return (
    <div className="manage-orders">
      {/* Header */}
      <div className="page-header">
        <h1>Quản lý đặt hàng</h1>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchOrders}>
            Làm mới
          </button>
          <button className="btn btn-primary">Xuất CSV</button>
        </div>
      </div>

      {/* Toolbar: Tìm kiếm & Filter */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Tìm mã đơn hoặc tên khách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Đã hủy</option>
        </select>
      </div>

      {/* Table danh sách */}
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  
                  {/* Tên khách hàng: Điều chỉnh field name theo DB của bạn */}
                  <td>
                    <div className="customer-name">{order.customerName || "Khách vãng lai"}</div>
                    <div className="customer-phone">{order.phone}</div>
                  </td>

                  {/* Ngày đặt: Xử lý hiển thị ngày */}
                  <td>
                    {order.createdAt 
                      ? new Date(order.createdAt).toLocaleDateString("vi-VN") 
                      : "N/A"}
                  </td>

                  {/* Địa chỉ (bao gồm Tỉnh thành vừa làm ở form Register) */}
                  <td className="order-address">
                    {order.address || "Không có địa chỉ"}
                  </td>

                  <td className="price">{formatCurrency(order.totalAmount || 0)}</td>
                  
                  <td>{getStatusBadge(order.status)}</td>
                  
                  <td>
                    <div className="action-buttons">
                      {order.status === "pending" && (
                        <>
                          <button
                            className="btn-icon approve"
                            title="Duyệt đơn"
                            onClick={() => handleUpdateStatus(order.id, "approved")}
                          >
                            ✓
                          </button>
                          <button
                            className="btn-icon reject"
                            title="Từ chối"
                            onClick={() => handleUpdateStatus(order.id, "rejected")}
                          >
                            ✕
                          </button>
                        </>
                      )}
                      <button
                        className="btn-icon delete"
                        title="Xóa đơn"
                        onClick={() => handleDelete(order.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-message">
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;