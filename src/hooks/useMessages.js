import { useQuery, useMutation } from '@tanstack/react-query';
import messageService from '../services/messageService';

export function useMessages(conversationId) {
  const messages = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messageService.list(conversationId),
    enabled: !!conversationId
  });

  const send = useMutation({
    mutationFn: (data) => messageService.send(data)
  });

  return { messages, send };
}
