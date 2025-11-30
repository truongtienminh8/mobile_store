import api from './api'

export const reviewService = {
  async list(params = {}) {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') search.append(k, v)
    })
    const { data } = await api.get(`/reviews${search.toString() ? `?${search.toString()}` : ''}`)
    return data
  },

  async create(payload) {
    const { data } = await api.post('/reviews', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/reviews/${id}`, payload)
    return data
  },

  async remove(id) {
    const { data } = await api.delete(`/reviews/${id}`)
    return data
  },
}


