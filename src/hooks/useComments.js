import { useMutation } from '@tanstack/react-query';
import commentService from '../services/commentService';

export function useComments() {
  const create = useMutation({ mutationFn: commentService.create });
  const update = useMutation({
    mutationFn: ({ id, data }) => commentService.update(id, data)
  });
  const remove = useMutation({
    mutationFn: (id) => commentService.remove(id)
  });

  return { create, update, remove };
}
