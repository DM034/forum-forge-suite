import apiClient from "@/api/apiClient";

const adminService = {
  stats: () => apiClient.get("/admin/stats"),
  roles: () => apiClient.get("/admin/roles"),

  users: (params) => apiClient.get("/admin/users", { params }),
  setUserRole: (userId, roleId) =>
    apiClient.patch(`/admin/users/${userId}/role`, { roleId }),
  setUserBlocked: (userId, blocked) =>
    apiClient.patch(`/admin/users/${userId}/block`, { blocked }),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),

  posts: (params) => apiClient.get("/admin/posts", { params }),
  setPostVisibility: (postId, deleted) =>
    apiClient.patch(`/admin/posts/${postId}/visibility`, { deleted }),

  comments: (params) => apiClient.get("/admin/comments", { params }),
  setCommentVisibility: (commentId, deleted) =>
    apiClient.patch(`/admin/comments/${commentId}/visibility`, { deleted }),
};

export default adminService;
