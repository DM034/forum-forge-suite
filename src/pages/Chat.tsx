import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Smile, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
};

type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

const Chat = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const conversations: Conversation[] = useMemo(
    () => [
      { id: "c2", name: "Raul Jiménez", lastMessage: "J’envoie la maquette mise à jour.", time: "Il y a 1h", unread: 0, online: true },
      { id: "c1", name: "Lucia Schaefer", lastMessage: "Parfait, à demain 10h.", time: "Il y a 2m", unread: 2 },
      { id: "c3", name: "Équipe Design", lastMessage: "Récap de la réunion partagé.", time: "Il y a 3h", unread: 5 },
      { id: "c4", name: "Nadia Ben Youssef", lastMessage: "Merci pour le tuto vidéo.", time: "Hier", unread: 0 },
      { id: "c5", name: "Marco Rossi", lastMessage: "Le bug d’upload est réglé.", time: "Hier", unread: 0 },
      { id: "c6", name: "Support Modération", lastMessage: "Signalement traité.", time: "Il y a 2j", unread: 0 },
      { id: "c7", name: "Aina Rakoto", lastMessage: "On publie à 18h ?", time: "Il y a 2j", unread: 1 }
    ],
    []
  );

  const messagesByConv: Record<string, Message[]> = useMemo(
    () => ({
      c1: [
        { id: "m1", from: "them", text: "J’envoie la maquette mise à jour.", time: "10:20" },
        { id: "m2", from: "me", text: "Bien reçu, je valide d’ici midi.", time: "10:22" }
      ],
      c2: [
        { id: "m1", from: "them", text: "Salut ! Tu es dispo pour finaliser le post ?", time: "09:00" },
        { id: "m2", from: "me", text: "Oui, je relis le texte et je te ping.", time: "09:01" },
        { id: "m3", from: "them", text: "Super. On garde le ton pédagogique.", time: "09:03" },
        { id: "m4", from: "me", text: "Oui, j’ai simplifié le paragraphe d’intro.", time: "09:05" },
        { id: "m5", from: "them", text: "Top. Tu peux ajouter un visuel léger ?", time: "09:07" },
        { id: "m6", from: "me", text: "Oui, je propose une capture annotée.", time: "09:08" },
        { id: "m7", from: "them", text: "Ok. Et le CTA en fin d’article ?", time: "09:10" },
        { id: "m8", from: "me", text: "Je mets \"Voir le guide complet\".", time: "09:11" },
        { id: "m9", from: "them", text: "Nickel. On programme pour 18h ?", time: "09:12" },
        { id: "m10", from: "me", text: "Ça me va, je planifie dans l’outil.", time: "09:13" },
        { id: "m11", from: "them", text: "Tu peux aussi préparer la version LinkedIn.", time: "09:15" },
        { id: "m12", from: "me", text: "Fait, avec un résumé en 3 bullets.", time: "09:17" },
        { id: "m13", from: "them", text: "Parfait, j’ajoute les hashtags.", time: "09:20" },
        { id: "m14", from: "me", text: "Je vérifie une dernière fois l’orthographe.", time: "09:22" },
        { id: "m15", from: "them", text: "Merci. Le lien du drive est à jour.", time: "09:24" },
        { id: "m16", from: "me", text: "Bien reçu, je synchronise les assets.", time: "09:26" },
        { id: "m17", from: "them", text: "Tu me confirmes quand c’est live ?", time: "09:28" },
        { id: "m18", from: "me", text: "Oui, je t’envoie un screenshot après publication.", time: "09:30" },
        { id: "m19", from: "them", text: "Top, merci pour la réactivité.", time: "09:35" },
        { id: "m20", from: "me", text: "Avec plaisir, on débriefe demain 10h.", time: "09:36" }
      ],
      c3: [
        { id: "m1", from: "them", text: "Récap de la réunion partagé dans le drive.", time: "08:01" },
        { id: "m2", from: "me", text: "Merci ! Je vérifie la section retours.", time: "08:05" },
        { id: "m3", from: "them", text: "On vise un prototype vendredi.", time: "08:08" }
      ],
      c4: [
        { id: "m1", from: "them", text: "Merci pour le tuto vidéo.", time: "Hier" },
        { id: "m2", from: "me", text: "Avec plaisir. Dis-moi si tu bloques.", time: "Hier" }
      ],
      c5: [
        { id: "m1", from: "them", text: "Le bug d’upload est réglé.", time: "Hier" },
        { id: "m2", from: "me", text: "Génial. Je relance le planificateur.", time: "Hier" }
      ],
      c6: [
        { id: "m1", from: "them", text: "Signalement traité. Publication rétablie.", time: "Il y a 2j" },
        { id: "m2", from: "me", text: "Merci pour la réactivité.", time: "Il y a 2j" }
      ],
      c7: [
        { id: "m1", from: "them", text: "On publie à 18h ?", time: "Il y a 2j" },
        { id: "m2", from: "me", text: "Oui, je programme et je te confirme.", time: "Il y a 2j" }
      ]
    }),
    []
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile && activeIndex === null) {
      setActiveIndex(0);
    }
  }, [isMobile, activeIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  const activeConv = activeIndex !== null ? conversations[activeIndex] : null;
  const activeMessages = activeConv ? messagesByConv[activeConv.id] ?? [] : [];

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden -mt-16 pt-16">
        <div
          className={`${
            isMobile ? (activeIndex !== null ? "hidden" : "w-full") : "w-80"
          } border-r border-border bg-card flex-shrink-0 flex flex-col`}
        >
          <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">{t("chat.title")}</h2>
          </div>
          <ScrollArea className="flex-1">
            {conversations.map((conv, index) => {
              const initials = conv.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveIndex(index)}
                  role="button"
                  tabIndex={0}
                  className="p-3 sm:p-4 border-b border-border hover:bg-secondary cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar
                      className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/profile");
                      }}
                    >
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs sm:text-sm font-semibold truncate">{conv.name}</h3>
                        <span className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {conv.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-[10px] sm:text-xs rounded-full px-1.5 sm:px-2 py-0.5 flex-shrink-0 ml-2">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>

        <div
          className={`${
            isMobile ? (activeIndex === null ? "hidden" : "w-full") : "flex-1"
          } flex flex-col min-w-0`}
        >
          <div className="p-3 sm:p-4 border-b border-border bg-card flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => setActiveIndex(null)}
                  aria-label="Retour"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}
              {activeConv && (
                <div
                  className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate("/profile")}
                >
                  <Avatar className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                      {activeConv.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold truncate">{activeConv.name}</h3>
                    <p className={`text-[10px] sm:text-xs ${activeConv.online ? "text-green-600" : "text-muted-foreground"}`}>
                      {activeConv.online ? t("chat.online") : t("chat.offline")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
                {activeMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2 sm:gap-3 ${m.from === "me" ? "justify-end" : ""}`}
                  >
                    {m.from === "them" && (
                      <Avatar
                        className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate("/profile")}
                      >
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {activeConv
                            ? activeConv.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : ""}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 sm:px-4 max-w-[75%] sm:max-w-[80%] md:max-w-md ${
                        m.from === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      <p className="text-xs sm:text-sm">{m.text}</p>
                      <div
                        className={`text-[10px] sm:text-xs mt-1 ${
                          m.from === "me" ? "opacity-80" : "text-muted-foreground"
                        }`}
                      >
                        {m.time}
                      </div>
                    </div>
                  </div>
                ))}
                {activeMessages.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground">
                    {t("chat.empty")}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-2 sm:p-3 md:p-4 border-t border-border bg-card flex-shrink-0 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center gap-1 sm:gap-2 max-w-3xl mx-auto">
              <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Input
                placeholder={t("chat.typeMessage")}
                className="flex-1 h-8 sm:h-10 text-xs sm:text-sm"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                onClick={() => setDraft("")}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
