import apiClient from '../api/apiClient';

const commentService = {
  create: (data) => apiClient.post('/comments', data),
  update: (id, data) => apiClient.put(`/comments/${id}`, data),
  remove: (id) => apiClient.delete(`/comments/${id}`)
};

export default commentService;
