import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Smile, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

const Chat = () => {
  const { t } = useTranslation();
  const conversations = [
    { name: "Lucia Schaefer", lastMessage: "À demain !", time: "Il y a 2m", unread: 2 },
    { name: "Raul Jiménez", lastMessage: "Merci pour les retours", time: "Il y a 1h", unread: 0 },
    { name: "Équipe Design", lastMessage: "Nouvelles idées de projet", time: "Il y a 3h", unread: 5 },
  ];

  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Keep a split view on desktop, single-pane navigation on mobile
  useEffect(() => {
    if (!isMobile && activeIndex === null) {
      setActiveIndex(0);
    }
  }, [isMobile]);

  return (
    <Layout>
      <div className="flex h-[calc(100dvh-4rem)] overflow-hidden">
        {/* Conversations list */}
        <div
          className={`w-full md:w-80 border-r border-border bg-card flex-shrink-0 ${
            isMobile ? (activeIndex !== null ? "hidden" : "block") : "block"
          }`}
        >
          <div className="p-3 sm:p-4 border-b border-border">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">{t("chat.title")}</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-3.5rem)] sm:h-[calc(100%-4rem)]">
            {conversations.map((conv, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                role="button"
                tabIndex={0}
                className="p-3 sm:p-4 border-b border-border hover:bg-secondary cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Avatar className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                      {conv.name.split(" ").map((n) => n[0]).join("")}
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
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-[10px] sm:text-xs rounded-full px-1.5 sm:px-2 py-0.5 flex-shrink-0 ml-2">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages panel */}
        <div className={`flex-1 flex flex-col min-w-0 ${isMobile && activeIndex === null ? "hidden" : ""}`}>
          <div className="p-3 sm:p-4 border-b border-border bg-card">
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
              <Avatar className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">LS</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-semibold truncate">Lucia Schaefer</h3>
                <p className="text-[10px] sm:text-xs text-green-600">En ligne</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
            <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
              <div className="flex gap-2 sm:gap-3">
                <Avatar className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">LS</AvatarFallback>
                </Avatar>
                <div className="bg-secondary rounded-lg px-3 py-2 sm:px-4 max-w-[75%] sm:max-w-[80%] md:max-w-md">
                  <p className="text-xs sm:text-sm">Salut ! Comment vas-tu ?</p>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 justify-end">
                <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 sm:px-4 max-w-[75%] sm:max-w-[80%] md:max-w-md">
                  <p className="text-xs sm:text-sm">Salut ! Je vais très bien, merci de demander !</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 sm:p-3 md:p-4 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center gap-1 sm:gap-2 max-w-3xl mx-auto">
              <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Input
                placeholder={t("chat.typeMessage")}
                className="flex-1 h-8 sm:h-10 text-xs sm:text-sm"
              />
              <Button size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
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
