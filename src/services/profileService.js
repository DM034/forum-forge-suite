import apiClient from '../api/apiClient';

const profileService = {
  getById: (id) => apiClient.get(`/profiles/${id}`),
  update: (id, data) =>
    apiClient.put(`/profiles/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export default profileService;
