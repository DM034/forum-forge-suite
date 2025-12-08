// src/services/apiChat.js
import apiClient from '../api/apiClient';

/**
 * Service d'accès à l'API de messagerie :
 * - utilisateurs (contacts)
 * - conversations
 * - messages
 */
const chatService = {
  /**
   * Récupère la liste des utilisateurs (contacts possibles pour une nouvelle conversation)
   * GET /users
   */
  getUsers: () => apiClient.get('/users'),

  /**
   * Récupère la liste des conversations de l'utilisateur courant
   * GET /messages/conversations
   */
  getConversations: () => apiClient.get('/messages/conversations'),

  /**
   * Récupère les messages d'une conversation
   * GET /messages/:conversationId?page=&limit=
   *
   * @param {string} conversationId
   * @param {object} options { page?: number, limit?: number }
   */
  getMessages: (conversationId, options = {}) => {
    const { page = 1, limit = 20 } = options;
    return apiClient.get(`/messages/${conversationId}`, {
      params: { page, limit }
    });
  },

  /**
   * Crée une nouvelle conversation
   * POST /messages/conversations
   *
   * @param {string[]} members - liste d'IDs utilisateur
   */
  createConversation: (members) =>
    apiClient.post('/messages/conversations', { members }),

  /**
   * Envoie un message dans une conversation
   * POST /messages/send
   *
   * payload = {
   *   conversationId: string,
   *   senderId: string,
   *   content: string,
   *   attachmentUrl?: string | null
   * }
   */
  sendMessage: (payload) =>
    apiClient.post('/messages/send', {
      conversationId: payload.conversationId,
      senderId: payload.senderId,
      content: payload.content,
      attachmentUrl: payload.attachmentUrl ?? null
    })
};

export default chatService;
