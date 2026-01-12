import apiClient from '../api/apiClient';

const profileService = {
  getById: (id) => apiClient.get(`/profile/${id}`),
  update: (id, data) =>
    apiClient.put(`/profile/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export default profileService;
