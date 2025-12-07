import apiClient from "../api/apiClient";

const postService = {
  list: async (page = 1, limit = 10) => {
    const res = await apiClient.get(`/posts?page=${page}&limit=${limit}`);
    return res.data; 
  },
  getById: (id) => apiClient.get(`/posts/${id}`),
  create: (formData) =>
    apiClient.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) => apiClient.put(`/posts/${id}`, data),
  remove: (id) => apiClient.delete(`/posts/${id}`),
};

export default postService;
