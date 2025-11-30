const ManageCarts = () => {
  return (
    <div className="manage-carts">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Quản lý giỏ hàng</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn">Làm mới</button>
          <button className="btn btn-danger">Xoá giỏ trống</button>
        </div>
      </div>
      <div className="empty" style={{ marginTop: 12 }}>Chức năng đang được phát triển</div>
    </div>
  )
};

export default ManageCarts;
