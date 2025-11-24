import { useQuery, useMutation } from '@tanstack/react-query';
import notificationService from '../services/notificationService';

export function useNotifications() {
  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.list
  });

  const markAsRead = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id)
  });

  const markAll = useMutation({
    mutationFn: notificationService.markAll
  });

  return { notifications, markAsRead, markAll };
}
