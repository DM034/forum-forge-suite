import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";

const Chat = () => {
  const conversations = [
    { name: "Lucia Schaefer", lastMessage: "See you tomorrow!", time: "2m ago", unread: 2 },
    { name: "Raul Jiménez", lastMessage: "Thanks for the feedback", time: "1h ago", unread: 0 },
    { name: "Design Team", lastMessage: "New project ideas", time: "3h ago", unread: 5 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-16 h-screen">
          <div className="flex h-full">
            <div className="w-80 border-r border-border bg-card">
              <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold">Messages</h2>
              </div>
              <div className="overflow-y-auto">
                {conversations.map((conv, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-border hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {conv.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold truncate">{conv.name}</h3>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
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

            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary">LS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">Lucia Schaefer</h3>
                    <p className="text-xs text-green-600">Online</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary">LS</AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary rounded-lg px-4 py-2 max-w-md">
                      <p className="text-sm">Hey! How are you doing?</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-md">
                      <p className="text-sm">Hi! I'm doing great, thanks for asking!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
