import { Home, Users, Lightbulb, MessageSquare, LogOut } from "lucide-react";
import { NavLink } from "./NavLink";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const navItems = [
    // { icon: Home, label: t('nav.dashboard'), path: "/dashboard" },
    { icon: Users, label: t('nav.community'), path: "/community" },
    { icon: Lightbulb, label: t('nav.inspirations'), path: "/inspirations" },
    { icon: MessageSquare, label: t('nav.chat'), path: "/chat" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon" className="transition-all duration-300 ease-in-out">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border transition-all duration-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-110">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {open && (
              <span className="font-semibold animate-fade-in">SNMVM</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="transition-opacity duration-200">
            {open ? t('nav.navigation') : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, index) => (
                <SidebarMenuItem 
                  key={item.path}
                  className="transition-all duration-200"
                  style={{ 
                    transitionDelay: open ? `${index * 50}ms` : '0ms' 
                  }}
                >
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    className="transition-all duration-200 hover:translate-x-1"
                  >
                    <NavLink 
                      to={item.path}
                      className="flex items-center gap-3"
                      activeClassName="font-medium"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {open && (
                        <span className="animate-fade-in">{item.label}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="transition-all duration-200 hover:translate-x-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  {open && (
                    <span className="animate-fade-in">{t('common.logout')}</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
