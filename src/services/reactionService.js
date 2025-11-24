import apiClient from '../api/apiClient';

const reactionService = {
  create: (data) => apiClient.post('/reactions', data),
  remove: (id) => apiClient.delete(`/reactions/${id}`)
};

export default reactionService;
