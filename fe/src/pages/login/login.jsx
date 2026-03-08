import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // 1. Thêm state cho checkbox "Ghi nhớ"
  const [rememberMe, setRememberMe] = useState(false) 
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // 2. Truyền thêm biến rememberMe vào hàm login (nếu AuthContext hỗ trợ)
    // Thông thường biến này dùng để quyết định lưu token vào localStorage (lâu dài) hay sessionStorage (tạm thời)
    const result = await login(email, password, rememberMe)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Đăng nhập thất bại')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Đăng nhập</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* 3. Thêm Checkbox Ghi nhớ đăng nhập */}
          <div className="form-group remember-me-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            Đăng nhập
          </button>
        </form>
        <p>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}

export default Login