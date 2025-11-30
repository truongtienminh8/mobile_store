import api from './api'

export const userService = {
  search(params = {}) {
    return api.get('/admin/users', { params })
  },
  updateRole(userId, role) {
    return api.patch(`/admin/users/${userId}/role`, { role })
  },
}


