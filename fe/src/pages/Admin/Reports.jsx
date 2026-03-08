import { useMemo, useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import './Reports.css'

const Reports = () => {
  const [range, setRange] = useState('week')
  const [stats, setStats] = useState(null) // State lưu dữ liệu thật
  const [loading, setLoading] = useState(true)

  // Hàm gọi API lấy số liệu thật
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        // THAY ĐỔI ĐƯỜNG DẪN NÀY THÀNH API THỰC TẾ CỦA BẠN
        // Ví dụ: http://localhost:8080/api/reports?range=week
        const response = await fetch(`http://localhost:8080/api/reports?range=${range}`);
        
        if (!response.ok) throw new Error('Lỗi kết nối API');
        
        const data = await response.json();
        // Giả sử API trả về json dạng: { search: 100, view: 500, addToCart: 50, purchase: 10 }
        setStats({
          label: getRangeLabel(range),
          ...data
        });
      } catch (error) {
        console.error("Không lấy được dữ liệu:", error);
        // Dữ liệu mẫu dự phòng nếu chưa có API (để không bị crash trang)
        setStats({
          label: getRangeLabel(range),
          search: 0, view: 0, addToCart: 0, purchase: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [range]);

  const getRangeLabel = (r) => {
    if (r === 'week') return '7 ngày qua';
    if (r === 'month') return '30 ngày qua';
    return 'Quý gần nhất';
  };

  // Tính toán biểu đồ (chỉ chạy khi có stats)
  const chartSeries = useMemo(() => {
    if (!stats) return [];
    const maxValue = Math.max(stats.search, stats.view, stats.addToCart, stats.purchase) || 1
    return [
      { key: 'search', label: 'Tìm kiếm', value: stats.search, color: '#6366f1' },
      { key: 'view', label: 'Xem sản phẩm', value: stats.view, color: '#0ea5e9' },
      { key: 'addToCart', label: 'Thêm vào giỏ', value: stats.addToCart, color: '#f97316' },
      { key: 'purchase', label: 'Mua hàng', value: stats.purchase, color: '#16a34a' },
    ].map((item) => ({
      ...item,
      height: Math.max(8, (item.value / maxValue) * 100),
    }))
  }, [stats])

  const totalInteractions = stats ? (stats.search + stats.view + stats.addToCart + stats.purchase) : 0;

  const exportPDF = () => {
    if (!stats) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const margin = 40
    let cursorY = margin

    doc.setFontSize(18)
    doc.text('BÁO CÁO THỐNG KÊ HOẠT ĐỘNG', margin, cursorY)
    cursorY += 24

    doc.setFontSize(12)
    doc.text(`Khoảng thời gian: ${stats.label}`, margin, cursorY)
    cursorY += 18
    doc.text(`Ngày tạo: ${new Date().toLocaleString('vi-VN')}`, margin, cursorY)
    cursorY += 30

    doc.setFont(undefined, 'bold')
    doc.text('Tổng quan', margin, cursorY)
    doc.setFont(undefined, 'normal')
    cursorY += 20

    const summary = [
      ['Tổng tương tác', totalInteractions.toLocaleString('vi-VN')],
      ['Tìm kiếm', stats.search.toLocaleString('vi-VN')],
      ['Xem sản phẩm', stats.view.toLocaleString('vi-VN')],
      ['Thêm vào giỏ', stats.addToCart.toLocaleString('vi-VN')],
      ['Mua hàng', stats.purchase.toLocaleString('vi-VN')],
    ]

    summary.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, margin, cursorY)
      cursorY += 18
    })

    // ... (Phần nhận xét giữ nguyên logic cũ) ...
    cursorY += 12
    doc.setFont(undefined, 'bold')
    doc.text('Nhận xét nhanh', margin, cursorY)
    doc.setFont(undefined, 'normal')
    cursorY += 18

    // Tránh chia cho 0
    const viewCount = stats.view || 1;
    const totalCount = totalInteractions || 1;

    doc.text(`- Tỷ lệ thêm vào giỏ hàng chiếm ${((stats.addToCart / viewCount) * 100).toFixed(1)}% tổng số lượt xem.`, margin, cursorY)
    cursorY += 16
    doc.text(`- Tỷ lệ chuyển đổi mua hàng đạt ${((stats.purchase / viewCount) * 100).toFixed(1)}%.`, margin, cursorY)
    cursorY += 16
    doc.text(`- Tổng lượt tìm kiếm chiếm ${((stats.search / totalCount) * 100).toFixed(1)}% toàn bộ tương tác.`, margin, cursorY)

    doc.save(`bao-cao-hoat-dong-${range}.pdf`)
  }

  // Render Loading khi đang tải
  if (loading || !stats) {
    return <div className="reports-page"><div className="loading">Đang tải dữ liệu báo cáo...</div></div>;
  }

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <p className="eyebrow">Báo cáo & Biểu đồ</p>
          <h1>Hiệu suất hành trình khách hàng</h1>
          <span>Số liệu thực tế từ hệ thống</span>
        </div>

        <div className="reports-actions">
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="quarter">Quý gần nhất</option>
          </select>
          <button type="button" className="export-btn" onClick={exportPDF}>
            Xuất file PDF
          </button>
        </div>
      </header>

      <section className="reports-summary">
        <div className="summary-card">
          <p>Tổng tương tác</p>
          <h2>{totalInteractions.toLocaleString('vi-VN')}</h2>
          <span>{stats.label}</span>
        </div>
        <div className="summary-card">
          <p>Tỷ lệ thêm giỏ / xem</p>
          <h2>{stats.view ? ((stats.addToCart / stats.view) * 100).toFixed(1) : 0}%</h2>
          <span>{stats.addToCart.toLocaleString('vi-VN')} lượt thêm giỏ</span>
        </div>
        <div className="summary-card">
          <p>Tỷ lệ mua / xem</p>
          <h2>{stats.view ? ((stats.purchase / stats.view) * 100).toFixed(1) : 0}%</h2>
          <span>{stats.purchase.toLocaleString('vi-VN')} đơn hàng</span>
        </div>
        <div className="summary-card">
          <p>Tổng tìm kiếm</p>
          <h2>{stats.search.toLocaleString('vi-VN')}</h2>
          <span>Dữ liệu thực</span>
        </div>
      </section>

      <section className="reports-chart">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Biểu đồ số lượng tương tác</h3>
              <p>So sánh theo hành động trong {stats.label}</p>
            </div>
          </div>
          <div className="chart-bars">
            {chartSeries.map((item) => (
              <div key={item.key} className="chart-bar">
                <div
                  className="chart-bar__fill"
                  style={{ height: `${item.height}%`, backgroundColor: item.color }}
                >
                  <span>{item.value.toLocaleString('vi-VN')}</span>
                </div>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reports-table">
        <h3>Bảng thống kê chi tiết</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Hạng mục</th>
                <th>Số lượng</th>
                <th>Tỷ trọng</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {chartSeries.map((item) => (
                <tr key={item.key}>
                  <td>{item.label}</td>
                  <td>{item.value.toLocaleString('vi-VN')}</td>
                  <td>{totalInteractions ? ((item.value / totalInteractions) * 100).toFixed(1) : 0}%</td>
                  <td>
                    {item.key === 'purchase'
                      ? 'Đơn hàng thành công'
                      : item.key === 'addToCart'
                        ? 'Người dùng có ý định mua'
                        : item.key === 'view'
                          ? 'Quan tâm chi tiết sản phẩm'
                          : 'Xuất phát từ nhu cầu tìm kiếm'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Reports