import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Hỗ trợ thanh toán</h3>
            <div className="payment-methods">
              {/* ZaloPay */}
              <div className="payment-item">
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
                  alt="ZaloPay"
                  className="payment-logo"
                />
              </div>
              {/* VNPAY */}
              <div className="payment-item">
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png"
                  alt="VNPAY"
                  className="payment-logo"
                />
              </div>
              {/* MoMo */}
              <div className="payment-item">
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png"
                  alt="MoMo"
                  className="payment-logo"
                />
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3>Chính sách hỗ trợ</h3>
            <ul>
              <li>
                <Link to="/policy/shipping">Giao hàng</Link>
              </li>
              <li>
                <Link to="/policy/return">Đổi trả/Hoàn hàng</Link>
              </li>
              <li>
                <Link to="/policy/warranty">Bảo hành/Sửa chữa linh kiện</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Hỗ trợ</h3>
            <ul>
              <li>Hotline: 1800 2097</li>
              <li>
                {" "}
                <a href="mailto:truongtienminh0501@gmail.com">
                  Gửi Email phản hồi
                </a>
              </li>
              <li>
                <Link to="/faq">Câu hỏi thường gặp</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Kết nối với chúng tôi</h3>
            <div className="social-links">
              {/* FACEBOOK */}
              <a
                href="https://www.facebook.com/trtienminh811"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link facebook"
              >
                <FaFacebook /> Facebook
              </a>

              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/tr.g_tienminh/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram"
              >
                <FaInstagram /> Instagram
              </a>

              {/* TIKTOK */}
              <a
                href="https://www.tiktok.com/@coitranranca51?lang=vi-VN"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link tiktok"
              >
                <FaTiktok /> TikTok
              </a>

              {/* YOUTUBE */}
              <a
                href="https://www.youtube.com/@minhtruong6797"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link youtube"
              >
                <FaYoutube /> YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Website. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;