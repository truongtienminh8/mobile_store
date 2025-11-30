import api from './api'

export const productService = {
  async getProducts(filters = {}) {
    try {
      const params = new URLSearchParams()
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key])
      })
      const response = await api.get(`/products?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to mock data for development
      return getMockProducts()
    }
  },

  async getProductsWithPagination(filters = {}) {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') params.append(k, v)
      })
      const { data } = await api.get(`/products?${params.toString()}`)
      if (data && data.data && data.pagination) {
        return { items: data.data, pagination: data.pagination }
      }
      // Fallback if server returned array only
      return { items: Array.isArray(data) ? data : [], pagination: { page: 1, limit: data?.length || 0, total: data?.length || 0, totalPages: 1 } }
    } catch (error) {
      console.error('Error fetching products with pagination:', error)
      const items = getMockProducts()
      return { items, pagination: { page: 1, limit: items.length, total: items.length, totalPages: 1 } }
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      // Fallback to mock data
      return getMockProducts().find((p) => p.id === id)
    }
  },

  async getFeaturedProducts() {
    try {
      const response = await api.get('/products/featured')
      return response.data
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return getMockProducts().slice(0, 8)
    }
  },

  async create(payload) {
    const { data } = await api.post('/products', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/products/${id}`, payload)
    return data
  },

  async remove(id) {
    const { data } = await api.delete(`/products/${id}`)
    return data
  },
}

// Mock data for development
function getMockProducts() {
  return [
    {
      id: 1,
      name: 'iPhone 17 Pro Max 256GB',
      price: 29990000,
      originalPrice: 32990000,
      discount: 9,
      image: '/images/iphone-17-pro-max.jpg',
      images: ['/images/iphone-17-pro-max.jpg'],
      brand: 'Apple',
      category: 'phone',
      ram: '8GB',
      storage: '256GB',
      screen: '6.9 inch Super Retina XDR',
      camera: '48MP + 12MP + 12MP',
      battery: '4422 mAh',
      os: 'iOS 18',
      description: '<p>iPhone 17 Pro Max với chip A19 Pro mạnh mẽ...</p>',
    },
    {
      id: 2,
      name: 'Samsung Galaxy S25 Ultra 512GB',
      price: 24990000,
      originalPrice: 27990000,
      discount: 11,
      image: '/images/galaxy-s25-ultra.jpg',
      brand: 'Samsung',
      category: 'phone',
      ram: '12GB',
      storage: '512GB',
      screen: '6.8 inch Dynamic AMOLED 2X',
      camera: '200MP + 50MP + 12MP + 10MP',
      battery: '5000 mAh',
      os: 'Android 15',
      description: '<p>Galaxy S25 Ultra với camera 200MP...</p>',
    },
    // Add more mock products...
  ]
}