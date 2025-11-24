import { useQuery, useMutation } from '@tanstack/react-query';
import postService from '../services/postService';

export function usePosts() {
  const posts = useQuery({
    queryKey: ['posts'],
    queryFn: postService.list
  });

  const create = useMutation({ mutationFn: postService.create });
  const update = useMutation({
    mutationFn: ({ id, data }) => postService.update(id, data)
  });
  const remove = useMutation({
    mutationFn: (id) => postService.remove(id)
  });

  return { posts, create, update, remove };
}
