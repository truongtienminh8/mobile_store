import api from './api'

export const newsService = {
  async list({ page = 1, limit = 6 } = {}) {
    const { data } = await api.get(`/news?page=${page}&limit=${limit}`)
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/news/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await api.post('/news', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/news/${id}`, payload)
    return data
  },

  async remove(id) {
    const { data } = await api.delete(`/news/${id}`)
    return data
  },
}


