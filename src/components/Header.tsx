import { Search, Bell, Settings, LogOut, User, MessageCircle, UserPlus, Heart, MessageSquare, CheckCheck, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { SidebarTrigger } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { useMemo, useState } from "react";

type NotificationItem = {
  id: string;
  type: "message" | "follow" | "like" | "comment";
  from: { id: number | string; name: string; avatar?: string };
  preview?: string;
  createdAt: string;
  read: boolean;
  link: string;
};

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "n1", type: "message", from: { id: 2, name: "Sarah Johnson" }, preview: t("chat.title", "Chat"), createdAt: new Date().toISOString(), read: false, link: "/chat?to=2" },
    { id: "n2", type: "follow", from: { id: 3, name: "Michael Chen" }, createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), read: false, link: "/profile/3" },
    { id: "n3", type: "like", from: { id: 4, name: "Emma Wilson" }, createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), read: false, link: "/community?openPost=p-demo-1&openComments=1" },
    { id: "n4", type: "comment", from: { id: 5, name: "Ryan Anderson" }, preview: t("post.comment", "Commenter"), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), read: true, link: "/community?openPost=p-demo-1&openComments=1" },
  ]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const getUserInitials = () => {
    const base =
      (user as any)?.fullName ||
      (user as any)?.username ||
      ((user as any)?.email ? String((user as any).email).split("@")[0] : "");
    if (!base) return "U";
    const parts = String(base).trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return base.substring(0, 2).toUpperCase();
  };

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const clearAll = () => setNotifications([]);
  const openNotification = (n: NotificationItem) => {
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    navigate(n.link);
  };

  const iconFor = (type: NotificationItem["type"]) => {
    if (type === "message") return <MessageCircle className="w-4 h-4 text-primary" />;
    if (type === "follow") return <UserPlus className="w-4 h-4 text-primary" />;
    if (type === "like") return <Heart className="w-4 h-4 text-primary" />;
    return <MessageSquare className="w-4 h-4 text-primary" />;
  };

  const formatWhen = (iso: string) =>
    new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(Math.round((new Date(iso).getTime() - Date.now()) / (1000 * 60)), "minutes");

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 w-full backdrop-blur-sm bg-card/95">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="transition-transform duration-200 hover:scale-110 active:scale-95" />
        <div className="flex items-center gap-2 sm:hidden">
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="font-semibold text-sm">SNMVM</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors duration-200" />
          <input
            type="text"
            placeholder={t("common.search")}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 focus:shadow-lg"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <LanguageSwitcher />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative transition-all duration-200 hover:scale-110 active:scale-95">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-[10px] leading-[18px] text-white text-center">{unreadCount}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="p-0">{t("notifications.title", "Notifications")}</DropdownMenuLabel>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={markAllRead}>
                  <CheckCheck className="w-4 h-4 mr-1" />
                  {t("notifications.markAllRead", "Tout lire")}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={clearAll}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t("notifications.clearAll", "Vider")}
                </Button>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && <div className="px-4 py-6 text-sm text-muted-foreground">{t("notifications.empty", "Aucune notification")}</div>}
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="py-3 px-3 gap-3 cursor-pointer" onClick={() => openNotification(n)}>
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={n.from.avatar || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{n.from.name.split(" ").map((s) => s[0]).join("")}</AvatarFallback>
                    </Avatar>
                    {!n.read && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {iconFor(n.type)}
                      <span className="text-sm text-card-foreground">
                        {n.type === "message" && `${t("notifications.messageFrom", "Message de")} ${n.from.name}`}
                        {n.type === "follow" && `${n.from.name} ${t("notifications.followedYou", "vous suit")}`}
                        {n.type === "like" && `${n.from.name} ${t("notifications.likedYourPost", "a aimé votre publication")}`}
                        {n.type === "comment" && `${n.from.name} ${t("notifications.commentedYourPost", "a commenté votre publication")}`}
                      </span>
                    </div>
                    {n.preview && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.preview}</div>}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{formatWhen(n.createdAt)}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-8 h-8 transition-transform duration-200 hover:scale-110 cursor-pointer">
              <AvatarImage src={(user as any)?.avatarUrl || (user as any)?.profile?.avatarUrl || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">{getUserInitials()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t("profile.title")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("common.settings")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("common.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
