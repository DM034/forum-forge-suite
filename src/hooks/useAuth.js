import { useMutation } from "@tanstack/react-query";
import authService from "@/services/authService";

export function useAuthApi() {
  const login = useMutation({
    mutationFn: ({ email, password }) => authService.login({ email, password }),
  });

  const signup = useMutation({
    mutationFn: ({ email, password, fullName }) =>
      authService.register({ email, password, fullName }),
  });

  return { login, signup };
}
