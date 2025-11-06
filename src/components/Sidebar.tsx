import { Home, Users, Lightbulb, MessageSquare, Settings, Zap, Pencil, Plus } from "lucide-react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Lightbulb, label: "Inspirations", path: "/inspirations" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const shortcuts = [
    { icon: Zap, label: "Scam", path: "/scam" },
    { icon: Pencil, label: "Draw", path: "/draw" },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">I</span>
          </div>
          <span className="font-semibold">Inter</span>
        </div>

        <div className="bg-secondary rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <div>
              <div className="text-sm font-medium">Fine Arts</div>
              <div className="text-xs text-muted-foreground">Workspace</div>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-sidebar-border">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">
            SHORTCUTS
          </div>
          {shortcuts.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              activeClassName="bg-sidebar-accent"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent transition-colors w-full">
            <Plus className="w-5 h-5" />
            <span>Add shortcut</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
