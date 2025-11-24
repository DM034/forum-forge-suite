import { useMutation } from '@tanstack/react-query';
import reactionService from '../services/reactionService';

export function useReactions() {
  const create = useMutation({ mutationFn: reactionService.create });
  const remove = useMutation({
    mutationFn: (id) => reactionService.remove(id)
  });

  return { create, remove };
}
