import { Home, Users, Lightbulb, MessageSquare, Settings } from "lucide-react";
import { NavLink } from "./NavLink";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { t } = useTranslation();
  const { open } = useSidebar();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: t('nav.dashboard'), path: "/dashboard" },
    { icon: Users, label: t('nav.community'), path: "/community" },
    { icon: Lightbulb, label: t('nav.inspirations'), path: "/inspirations" },
    { icon: MessageSquare, label: t('nav.chat'), path: "/chat" },
    { icon: Settings, label: t('nav.settings'), path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {open && <span className="font-semibold">SNMVM</span>}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <NavLink 
                      to={item.path}
                      className="flex items-center gap-3"
                      activeClassName="font-medium"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
