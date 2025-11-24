import apiClient from '../api/apiClient';

const notificationService = {
  list: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.put(`/notifications/read/${id}`),
  markAll: () => apiClient.put('/notifications/read-all')
};

export default notificationService;
