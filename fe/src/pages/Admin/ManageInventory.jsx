const ManageInventory = () => {
  return (
    <div className="manage-inventory">
      <h1>Quản lý tồn kho</h1>
      <p>Trang quản lý số lượng, nhập kho, xuất kho.</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="btn">Nhập kho</button>
        <button className="btn">Xuất kho</button>
        <button className="btn btn-primary">Thêm sản phẩm</button>
      </div>
      <div className="empty" style={{ marginTop: 12 }}>Chức năng đang được phát triển</div>
    </div>
  )
}

export default ManageInventory

