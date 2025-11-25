import apiClient from "@/api/apiClient";

const reactionService = {
  like: (postId) =>
    apiClient.post("/reactions", {
      postId,
      type: "like",
    }),

  unlike: (reactionId) =>
    apiClient.delete(`/reactions/${reactionId}`),
};

export default reactionService;
