import apiClient from '../api/apiClient';

const postService = {
  list: () => apiClient.get('/posts'),
  getById: (id) => apiClient.get(`/posts/${id}`),
  create: (data) =>
    apiClient.post('/posts', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  update: (id, data) => apiClient.put(`/posts/${id}`, data),
  remove: (id) => apiClient.delete(`/posts/${id}`)
};

export default postService;
