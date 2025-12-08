import { useQuery, useMutation } from '@tanstack/react-query';
import profileService from '../services/profileService';

export function useProfile(userId) {
  const profile = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getById(userId),
    enabled: !!userId
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => profileService.update(id, data)
  });

  return { profile, update };
}
