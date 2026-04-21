import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Swords, Home, Users, Trophy, User, Map, BookOpen, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/aog-logo.png";

const playItems = [
  { title: "Lobby", url: "/lobby", icon: Home },
  { title: "Combate", url: "/match", icon: Swords },
  { title: "Ranked", url: "/ranked", icon: Trophy },
];

const metaItems = [
  { title: "Coleção", url: "/collection", icon: BookOpen },
  { title: "Roadmap", url: "/roadmap", icon: Map },
  { title: "Clãs", url: "/clans", icon: Users },
];

const accountItems = [
  { title: "Perfil", url: "/profile", icon: User },
  { title: "Ajustes", url: "/settings", icon: Settings },
];

function MenuSection({ label, items, currentPath }: { label: string; items: typeof playItems; currentPath: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  return (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-[10px] font-display tracking-[0.2em] text-primary/70">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = currentPath === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <RouterNavLink
                    to={item.url}
                    className={`group relative flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary shadow-[inset_0_0_20px_hsl(var(--primary)/0.15)]"
                        : "hover:bg-sidebar-accent/60 text-sidebar-foreground"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
                    {!collapsed && <span className="font-body text-sm tracking-wide uppercase">{item.title}</span>}
                  </RouterNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/60 p-3">
        <div className="flex items-center gap-2">
          <img src={logo} alt="A.O.G — Arena of Gods" className="h-9 w-9 object-contain drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-display text-sm font-bold text-cyan">A.O.G</span>
              <span className="font-display text-[9px] tracking-[0.25em] text-muted-foreground">ARENA OF GODS</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <MenuSection label="JOGAR" items={playItems} currentPath={pathname} />
        <MenuSection label="META" items={metaItems} currentPath={pathname} />
        <MenuSection label="CONTA" items={accountItems} currentPath={pathname} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/60 p-3">
        {!collapsed && (
          <div className="text-[10px] font-display tracking-widest text-muted-foreground">
            v0.1 · PRE-ALPHA
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
