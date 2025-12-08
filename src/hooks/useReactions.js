import { useMutation, useQueryClient } from "@tanstack/react-query";
import reactionService from "@/services/reactionService";

export function useReaction() {
  const queryClient = useQueryClient();

  const react = useMutation({
    mutationFn: (postId) => reactionService.like(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const unreact = useMutation({
    mutationFn: (reactionId) => reactionService.unlike(reactionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  return { react, unreact };
}
