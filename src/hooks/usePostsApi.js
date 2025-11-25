import { useQuery } from "@tanstack/react-query";
import postService from "@/services/postService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function usePostsApi(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["posts", page, limit],
    queryFn: () => postService.list(page, limit),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
}

