import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useToast } from './ToastContext'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const toastApi = (() => {
    try {
      return useToast()
    } catch {
      return { show: () => {} }
    }
  })()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const persistAuth = (userData, token) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    if (token) {
      localStorage.setItem('token', token)
    }
  }

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      if (data.success) {
        persistAuth(data.user, data.token)
        toastApi.show('Đăng nhập thành công', 'success')
        return { success: true }
      }
      return { success: false, error: data.message || 'Đăng nhập thất bại' }
    } catch (error) {
      toastApi.show(error.response?.data?.message || 'Đăng nhập thất bại', 'error')
      return {
        success: false,
        error: error.response?.data?.message || 'Đăng nhập thất bại',
      }
    }
  }

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData)
      if (data.success) {
        persistAuth(data.user, data.token)
        toastApi.show('Đăng ký thành công', 'success')
        return { success: true }
      }
      return { success: false, error: data.message || 'Đăng ký thất bại' }
    } catch (error) {
      toastApi.show(error.response?.data?.message || 'Đăng ký thất bại', 'error')
      return {
        success: false,
        error: error.response?.data?.message || 'Đăng ký thất bại',
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    toastApi.show('Đã đăng xuất', 'info')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}