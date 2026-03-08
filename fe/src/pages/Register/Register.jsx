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
    address: "", // Trường này sẽ lưu tên Tỉnh/Thành phố được chọn
  });
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuggestion, setEmailSuggestion] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Danh sách 63 tỉnh thành Việt Nam
  const vietnamProvinces = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "TP. Hồ Chí Minh",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];

  // Danh sách các domain email phổ biến tại Việt Nam
  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "fpt.vn",
    "vnu.edu.vn",
    "hust.edu.vn",
    "hcmut.edu.vn",
  ];

  // --- CÁC HÀM VALIDATE GIỮ NGUYÊN ---
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const checkEmailSuggestion = (email) => {
    if (!email.includes("@")) return "";
    const [localPart, domainPart] = email.split("@");
    if (!domainPart) return "";

    const typos = {
      "gmail.con": "gmail.com",
      "gmail.cm": "gmail.com",
      "gmail.vom": "gmail.com",
      "gmai.com": "gmail.com",
      "gmial.com": "gmail.com",
      "yahoo.con": "yahoo.com",
      "yahoo.cm": "yahoo.com",
      "yaho.com": "yahoo.com",
      "outlok.com": "outlook.com",
      "outllook.com": "outlook.com",
      "hotmail.con": "hotmail.com",
      "hotmial.com": "hotmail.com",
    };

    if (typos[domainPart.toLowerCase()]) {
      return `${localPart}@${typos[domainPart.toLowerCase()]}`;
    }

    const domain = domainPart.toLowerCase();
    for (const commonDomain of commonDomains) {
      if (
        domain !== commonDomain &&
        (domain.includes(commonDomain.slice(0, -4)) ||
          levenshteinDistance(domain, commonDomain) <= 2)
      ) {
        return `${localPart}@${commonDomain}`;
      }
    }
    return "";
  };

  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (value) {
        if (!validateEmail(value)) {
          setEmailError("Email không hợp lệ (VD: example@gmail.com)");
          setEmailSuggestion("");
        } else {
          setEmailError("");
          const suggestion = checkEmailSuggestion(value);
          if (suggestion && suggestion !== value) {
            setEmailSuggestion(suggestion);
          } else {
            setEmailSuggestion("");
          }
        }
      } else {
        setEmailError("");
        setEmailSuggestion("");
      }
    }

    if (name === "phone") {
      if (value && !validatePhone(value)) {
        setPhoneError("Số điện thoại không hợp lệ (VD: 0912345678)");
      } else {
        setPhoneError("");
      }
    }

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

  const handleEmailSuggestionClick = () => {
    setFormData({ ...formData, email: emailSuggestion });
    setEmailSuggestion("");
    setEmailError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      setError("Email không hợp lệ");
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }
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
              placeholder="VD: example@gmail.com"
              required
              className={emailError ? "input-error" : ""}
            />
            {emailError && <span className="field-error">{emailError}</span>}
            {emailSuggestion && !emailError && (
              <div className="email-suggestion">
                Có phải bạn muốn nhập{" "}
                <span
                  className="suggestion-link"
                  onClick={handleEmailSuggestionClick}
                >
                  {emailSuggestion}
                </span>
                ?
              </div>
            )}
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
            </select>
          </div>

          {/* --- PHẦN ĐÃ SỬA: CHỌN TỈNH THÀNH --- */}
          <div className="form-group">
            <label>Tỉnh/Thành phố (Địa chỉ)</label>
            <select
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn Tỉnh/Thành phố --</option>
              {vietnamProvinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          {/* ------------------------------------- */}

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
