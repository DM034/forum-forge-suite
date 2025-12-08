import apiClient from '../api/apiClient';

const messageService = {
  list: (conversationId) =>
    apiClient.get(`/messages/${conversationId}`),

  send: (data) =>
    apiClient.post('/messages/send', data)
};

export default messageService;
