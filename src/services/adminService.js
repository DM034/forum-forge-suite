import apiClient from "@/api/apiClient";

const adminService = {
  stats: () => apiClient.get("/admin/stats"),
  roles: () => apiClient.get("/admin/roles"),

  users: (params: any) => apiClient.get("/admin/users", { params }),
  setUserRole: (userId: string, roleId: string) => apiClient.patch(`/admin/users/${userId}/role`, { roleId }),
  setUserBlocked: (userId: string, blocked: boolean) => apiClient.patch(`/admin/users/${userId}/block`, { blocked }),
  deleteUser: (userId: string) => apiClient.delete(`/admin/users/${userId}`),

  posts: (params: any) => apiClient.get("/admin/posts", { params }),
  setPostVisibility: (postId: string, deleted: boolean) =>
    apiClient.patch(`/admin/posts/${postId}/visibility`, { deleted }),

  comments: (params: any) => apiClient.get("/admin/comments", { params }),
  setCommentVisibility: (commentId: string, deleted: boolean) =>
    apiClient.patch(`/admin/comments/${commentId}/visibility`, { deleted }),
};

export default adminService;
