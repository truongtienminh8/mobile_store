import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    age: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate số điện thoại Việt Nam
  const validatePhone = (phone) => {
    // Regex cho số điện thoại VN: bắt đầu bằng 0, theo sau là 9 số
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate số điện thoại khi người dùng nhập
    if (name === "phone") {
      if (value && !validatePhone(value)) {
        setPhoneError("Số điện thoại không hợp lệ (VD: 0912345678)");
      } else {
        setPhoneError("");
      }
    }

    // Kiểm tra khớp mật khẩu khi người dùng nhập
    if (name === "password" || name === "confirmPassword") {
      const pwd = name === "password" ? value : formData.password;
      const confirmPwd =
        name === "confirmPassword" ? value : formData.confirmPassword;

      if (confirmPwd) {
        setPasswordMatch(pwd === confirmPwd);
      } else {
        setPasswordMatch(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate số điện thoại
    if (!validatePhone(formData.phone)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }

    // Validate mật khẩu khớp
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    // Validate độ dài mật khẩu
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      gender: formData.gender,
      age: formData.age,
      address: formData.address,
    });

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Đăng ký thất bại");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Đăng ký</h2>
        {error && <div className="error-message">{error}</div>}
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
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
              placeholder="VD: 0912345678"
              required
              className={phoneError ? "input-error" : ""}
            />
            {phoneError && <span className="field-error">{phoneError}</span>}
          </div>

          <div className="form-group">
            <label>Giới tính</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label>Độ tuổi</label>
            <input
              type="number"
              name="age"
              min="10"
              max="100"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tối thiểu 6 ký tự"
              required
            />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={
                passwordMatch === false
                  ? "input-error"
                  : passwordMatch === true
                  ? "input-success"
                  : ""
              }
            />
            {passwordMatch === true && formData.confirmPassword && (
              <span className="field-success">✓ Mật khẩu khớp</span>
            )}
            {passwordMatch === false && formData.confirmPassword && (
              <span className="field-error">✗ Mật khẩu không trùng khớp</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Đăng ký
          </button>
        </form>
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
