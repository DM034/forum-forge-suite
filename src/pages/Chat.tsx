// src/pages/Chat.tsx
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, Smile, ArrowLeft, Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";

import chatService from "@/services/apiChat";
// adapte ce chemin selon ton projet
import { useAuth } from "@/contexts/AuthContext";

// ---------- Types locaux (adaptés à ton API) ----------

interface UserProfile {
  fullName: string;
  avatarUrl: string;
}

interface User {
  id: string;
  email: string;
  roleId: string;
  profile: UserProfile;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachmentUrl: string | null;
  createdAt: string;
  readAt: string | null;
  sender: User;
}

interface Conversation {
  id: string;
  createdAt: string;
  lastMessage: Message | null;
  members: User[];
}

const Chat = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Récupération de l'utilisateur courant via le contexte d'auth
  const { user } = useAuth(); // suppose { user: { id: string, ... } }
  const currentUserId = user?.id ?? null;

  // --- Conversations ---
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(
    null
  );
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Contacts (users) pour la modale "nouvelle conversation" ---
  const [contacts, setContacts] = useState<User[]>([]);
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState("");

  // --- Messages ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // -------- Helpers --------

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId]
  );

  const getDisplayNameForConversation = (
    conversation: Conversation
  ): string => {
    const others = currentUserId
      ? conversation.members.filter((m) => m.id !== currentUserId)
      : conversation.members;

    if (others.length === 0) {
      const first = conversation.members[0];
      return first?.profile?.fullName || first?.email || conversation.id;
    }

    if (others.length === 1) {
      return others[0].profile?.fullName || others[0].email;
    }

    return others.map((m) => m.profile?.fullName || m.email).join(", ");
  };

  const getInitials = (userLike: Pick<User, "profile" | "email"> | null) => {
    if (!userLike) return "NC";
    const source = userLike.profile?.fullName || userLike.email || "?";
    return source
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const matchesConversationSearch = (conv: Conversation) => {
    if (!searchTerm.trim()) return true;

    const lower = searchTerm.toLowerCase();
    const title = getDisplayNameForConversation(conv).toLowerCase();
    const lastMsg = conv.lastMessage?.content?.toLowerCase() ?? "";

    return title.includes(lower) || lastMsg.includes(lower);
  };

  const filteredContacts = useMemo(() => {
    const term = contactSearchTerm.toLowerCase();
    if (!term) return contacts;
    return contacts.filter((c) => {
      const name = c.profile?.fullName?.toLowerCase() || "";
      const email = c.email.toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }, [contacts, contactSearchTerm]);

  // -------- Chargement des conversations --------

  useEffect(() => {
    // Si pas d'utilisateur connecté, on ne charge rien
    if (!currentUserId) return;

    const loadConversations = async () => {
      try {
        setConversationsLoading(true);
        setConversationsError(null);

        const res = await chatService.getConversations();
        // axios -> res.data = { success, message, data }
        const data = res.data.data as Conversation[];

        const sorted = [...data].sort((a, b) => {
          const da =
            a.lastMessage?.createdAt ?? a.createdAt ?? "1970-01-01T00:00:00Z";
          const db =
            b.lastMessage?.createdAt ?? b.createdAt ?? "1970-01-01T00:00:00Z";
          return new Date(db).getTime() - new Date(da).getTime();
        });

        setConversations(sorted);

        if (!isMobile && sorted.length > 0 && !activeConversationId) {
          setActiveConversationId(sorted[0].id);
        }
      } catch (err: any) {
        setConversationsError(
          err?.message ?? "Erreur lors du chargement des conversations"
        );
      } finally {
        setConversationsLoading(false);
      }
    };

    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  // Quand la taille change (mobile/desktop)
  useEffect(() => {
    if (!isMobile && !activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, conversations.length]);

  // -------- Chargement des messages pour la conversation active --------

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setMessagesLoading(true);
        setMessagesError(null);

        const res = await chatService.getMessages(activeConversationId, {
          page: 1,
          limit: 20,
        });
        // res.data = { success, message, data: { messages, nextCursor } }
        const data = res.data.data as {
          messages: Message[];
          nextCursor: string | null;
        };
        setMessages(data.messages);
      } catch (err: any) {
        setMessagesError(
          err?.message ?? "Erreur lors du chargement des messages"
        );
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  // -------- Chargement des contacts (pour nouvelle conversation) --------

  const openNewConversationModal = () => {
    setIsNewConversationOpen(true);

    if (!contactsLoaded && !contactsLoading) {
      const loadContacts = async () => {
        try {
          setContactsLoading(true);
          setContactsError(null);

          const res = await chatService.getUsers();
          const data = res.data.data as User[];

          setContacts(
            currentUserId
              ? data.filter((u) => u.id !== currentUserId)
              : data
          );
          setContactsLoaded(true);
        } catch (err: any) {
          setContactsError(
            err?.message ?? "Erreur lors du chargement des contacts"
          );
        } finally {
          setContactsLoading(false);
        }
      };

      loadContacts();
    }
  };

  // -------- Actions --------

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleBackToListMobile = () => {
    setActiveConversationId(null);
  };

  const handleSelectRecipient = async (recipient: User) => {
    if (!currentUserId) return;

    // Chercher une conversation existante 1-1 avec ce user
    const existing = conversations.find((conv) => {
      const members = conv.members;
      return (
        members.length === 2 &&
        members.some((m) => m.id === currentUserId) &&
        members.some((m) => m.id === recipient.id)
      );
    });

    if (existing) {
      setActiveConversationId(existing.id);
      setIsNewConversationOpen(false);
      return;
    }

    try {
      const res = await chatService.createConversation([
        currentUserId,
        recipient.id,
      ]);
      const newConv = res.data.data as Conversation;

      setConversations((prev) => {
        const merged = [newConv, ...prev];
        return merged.sort((a, b) => {
          const da =
            a.lastMessage?.createdAt ?? a.createdAt ?? "1970-01-01T00:00:00Z";
          const db =
            b.lastMessage?.createdAt ?? b.createdAt ?? "1970-01-01T00:00:00Z";
          return new Date(db).getTime() - new Date(da).getTime();
        });
      });

      setActiveConversationId(newConv.id);
      setIsNewConversationOpen(false);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!activeConversation || !messageInput.trim() || isSending) return;
    if (!currentUserId) return;

    const content = messageInput.trim();

    try {
      setIsSending(true);
      const res = await chatService.sendMessage({
        conversationId: activeConversation.id,
        senderId: currentUserId,
        content,
      });

      const newMessage = res.data.data as Message;

      // Ajout du message dans la liste
      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");

      // Mise à jour du lastMessage + tri des conversations
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === activeConversation.id ? { ...c, lastMessage: newMessage } : c
        );

        return [...updated].sort((a, b) => {
          const da =
            a.lastMessage?.createdAt ?? a.createdAt ?? "1970-01-01T00:00:00Z";
          const db =
            b.lastMessage?.createdAt ?? b.createdAt ?? "1970-01-01T00:00:00Z";
          return new Date(db).getTime() - new Date(da).getTime();
        });
      });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleMessageInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // -------- rendu --------

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden -mt-16 pt-16">
        {/* Liste des conversations */}
        <div
          className={`${
            isMobile ? (activeConversationId ? "hidden" : "w-full") : "w-80"
          } border-r border-border bg-card flex-shrink-0 flex flex-col`}
        >
          <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between flex-shrink-0 gap-2">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">
              {t("chat.title")}
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 flex items-center gap-1"
              onClick={openNewConversationModal}
              disabled={!currentUserId}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">
                {t("chat.newConversation") || "Nouvelle conversation"}
              </span>
            </Button>
          </div>

          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2 bg-muted rounded-md px-2 py-1.5">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  t("chat.searchPlaceholder") ||
                  "Rechercher une conversation..."
                }
                className="border-0 shadow-none h-7 sm:h-8 px-0 text-xs sm:text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {!currentUserId && (
              <div className="p-4 text-xs sm:text-sm text-muted-foreground">
                {t("chat.notAuthenticated") ||
                  "Veuillez vous connecter pour voir vos conversations."}
              </div>
            )}

            {currentUserId && conversationsLoading && (
              <div className="p-4 text-xs sm:text-sm text-muted-foreground">
                {t("common.loading") || "Chargement..."}
              </div>
            )}
            {conversationsError && (
              <div className="p-4 text-xs sm:text-sm text-red-500">
                {conversationsError}
              </div>
            )}

            {currentUserId &&
              !conversationsLoading &&
              !conversationsError &&
              conversations.filter(matchesConversationSearch).map((conv) => {
                const title = getDisplayNameForConversation(conv);
                const isActive = conv.id === activeConversationId;
                const lastMessageText =
                  conv.lastMessage?.content ||
                  t("chat.noMessageYet") ||
                  "Aucun message pour l’instant";

                const firstOther =
                  (currentUserId
                    ? conv.members.find((m) => m.id !== currentUserId)
                    : conv.members[0]) ?? null;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    role="button"
                    tabIndex={0}
                    className={`p-3 sm:p-4 border-b border-border hover:bg-secondary cursor-pointer transition-colors ${
                      isActive ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar
                        className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/profile");
                        }}
                      >
                        {/* <AvatarImage src={firstOther?.profile.avatarUrl} /> */}
                        <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                          {getInitials(firstOther)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-xs sm:text-sm font-semibold truncate">
                            {title}
                          </h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {lastMessageText}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </ScrollArea>
        </div>

        {/* Panneau de messages */}
        <div
          className={`${
            isMobile ? (activeConversationId ? "w-full" : "hidden") : "flex-1"
          } flex flex-col min-w-0`}
        >
          <div className="p-3 sm:p-4 border-b border-border bg-card flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                  onClick={handleBackToListMobile}
                  aria-label="Retour"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}

              <div
                className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => activeConversation && navigate("/profile")}
              >
                <Avatar className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                  {/* <AvatarImage
                    src={
                      activeConversation &&
                      (currentUserId
                        ? activeConversation.members.find(
                            (m) => m.id !== currentUserId
                          )?.profile.avatarUrl
                        : activeConversation.members[0]?.profile.avatarUrl)
                    }
                  /> */}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                    {getInitials(
                      activeConversation
                        ? currentUserId
                          ? activeConversation.members.find(
                              (m) => m.id !== currentUserId
                            ) ?? null
                          : activeConversation.members[0] ?? null
                        : null
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold truncate">
                    {activeConversation
                      ? getDisplayNameForConversation(activeConversation)
                      : t("chat.newConversation") || "Nouvelle conversation"}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-green-600">
                    {activeConversation
                      ? t("chat.statusOnline") || "En ligne"
                      : t("chat.newConversationSubtitle") ||
                        "Sélectionnez un contact puis commencez à écrire un message"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {messagesLoading && activeConversation && (
              <div className="p-4 text-xs sm:text-sm text-muted-foreground">
                {t("common.loading") || "Chargement des messages..."}
              </div>
            )}
            {messagesError && (
              <div className="p-4 text-xs sm:text-sm text-red-500">
                {messagesError}
              </div>
            )}

            {!messagesLoading &&
              !messagesError &&
              activeConversation &&
              messages.length === 0 && (
                <div className="h-full flex items-center justify-center px-4">
                  <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md">
                    {t("chat.noMessageYet") ||
                      "Aucun message pour l’instant. Envoyez le premier !"}
                  </p>
                </div>
              )}

            {!messagesLoading &&
              !messagesError &&
              activeConversation &&
              messages.length > 0 && (
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
                    {messages.map((msg) => {
                      const isOwn = currentUserId
                        ? msg.senderId === currentUserId
                        : false;
                      const sender = msg.sender;
                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-2 sm:gap-3 ${
                            isOwn ? "justify-end" : ""
                          }`}
                        >
                          {!isOwn && (
                            <Avatar
                              className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => navigate("/profile")}
                            >
                              {/* <AvatarImage src={sender.profile.avatarUrl} /> */}
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(sender)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg px-3 py-2 sm:px-4 max-w-[75%] sm:max-w-[80%] md:max-w-md ${
                              isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                            }`}
                          >
                            <p className="text-xs sm:text-sm">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {!activeConversation && (
              <div className="h-full flex items-center justify-center px-4">
                <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md">
                  {t("chat.newConversationHint") ||
                    "Cliquez sur « Nouvelle conversation » pour choisir un contact et démarrer un échange."}
                </p>
              </div>
            )}
          </ScrollArea>

          {/* Zone de saisie */}
          <div className="p-2 sm:p-3 md:p-4 border-t border-border bg-card flex-shrink-0 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center gap-1 sm:gap-2 max-w-3xl mx-auto">
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                disabled={!activeConversation || !currentUserId}
              >
                <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Input
                placeholder={t("chat.typeMessage")}
                className="flex-1 h-8 sm:h-10 text-xs sm:text-sm"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleMessageInputKeyDown}
                disabled={!activeConversation || isSending || !currentUserId}
              />
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                disabled={
                  !activeConversation ||
                  !messageInput.trim() ||
                  isSending ||
                  !currentUserId
                }
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modale de nouvelle conversation */}
      <Dialog
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("chat.newConversation") || "Nouvelle conversation"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-muted rounded-md px-2 py-1.5">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                value={contactSearchTerm}
                onChange={(e) => setContactSearchTerm(e.target.value)}
                placeholder={
                  t("chat.searchContactPlaceholder") ||
                  "Rechercher un contact..."
                }
                className="border-0 shadow-none h-8 px-0 text-xs sm:text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {contactsLoading && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("common.loading") || "Chargement des contacts..."}
              </p>
            )}
            {contactsError && (
              <p className="text-xs sm:text-sm text-red-500">{contactsError}</p>
            )}

            <ScrollArea className="max-h-64">
              <div className="space-y-1">
                {!contactsLoading &&
                  !contactsError &&
                  filteredContacts.length === 0 && (
                    <p className="text-xs sm:text-sm text-muted-foreground px-1 py-2">
                      {t("chat.noContactFound") || "Aucun contact trouvé."}
                    </p>
                  )}
                {filteredContacts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectRecipient(c)}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted text-left transition-colors"
                    disabled={!currentUserId}
                  >
                    <Avatar className="h-8 w-8">
                      {/* <AvatarImage src={c.profile.avatarUrl} /> */}
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(c)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm truncate">
                        {c.profile.fullName || c.email}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {c.email}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Chat;
