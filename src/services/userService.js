import apiClient from '../api/apiClient';

const userService = {
  getById: (id) => apiClient.get(`/users/${id}`),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  remove: (id) => apiClient.delete(`/users/${id}`)
};

export default userService;
