import { useQuery, useMutation } from '@tanstack/react-query';
import userService from '../services/userService';

export function useUser(userId) {
  const user = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getById(userId),
    enabled: !!userId
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data)
  });

  const remove = useMutation({
    mutationFn: (id) => userService.remove(id)
  });

  return { user, update, remove };
}
