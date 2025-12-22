import apiClient from "../api/apiClient";

const adminService = {
  getStats: () => apiClient.get("/admin/stats"),

  listUsers: (params) => apiClient.get("/admin/users", { params }),
  setUserRole: (userId, roleId) => apiClient.patch(`/admin/users/${userId}/role`, { roleId }),
  setUserBlocked: (userId, blocked) => apiClient.patch(`/admin/users/${userId}/block`, { blocked }),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),

  listPosts: (params) => apiClient.get("/admin/posts", { params }),
  setPostVisibility: (postId, deleted) =>
    apiClient.patch(`/admin/posts/${postId}/visibility`, { deleted }),

  listComments: (params) => apiClient.get("/admin/comments", { params }),
  setCommentVisibility: (commentId, deleted) =>
    apiClient.patch(`/admin/comments/${commentId}/visibility`, { deleted }),
};

export default adminService;
