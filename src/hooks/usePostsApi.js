// src/hooks/usePostsApi.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import postService from "@/services/postService";

export function usePostsApi(page = 1, limit = 10) {
  const FILES_URL = import.meta.env.VITE_FILES_URL;

  return useQuery({
    queryKey: ["posts", page, limit],
    queryFn: () => postService.list(page, limit),
    select: (payload) => {
      return {
        ...payload,
        data: payload.data.map((post) => ({
          ...post,
          attachments: post.attachments ?? [],
          attachmentUrls: (post.attachments ?? []).map(
            (att) => `${FILES_URL}${att.fileUrl}`
          ),
        })),
      };
    },
  });
}

// usePostsApi.js
export function useUserPostsApi(userId, page = 1, limit = 10) {
  const FILES_URL = import.meta.env.VITE_FILES_URL;

  return useQuery({
    queryKey: ["userPosts", userId, page, limit],
    enabled: !!userId,
    queryFn: () => postService.listByUser(userId),
    select: (payload) => {
      const rawPosts = Array.isArray(payload.data) ? payload.data : [];
      return {
        ...payload,
        data: rawPosts.map((post) => ({
          ...post,                       
          attachments: post.attachments ?? [],
          attachmentUrls: (post.attachments ?? []).map(
            (att) => `${FILES_URL}${att.fileUrl}`
          ),
        })),
      };
    },
  });
}





export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
}
