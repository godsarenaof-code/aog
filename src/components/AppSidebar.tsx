import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { swords, Home, Users, Trophy, User, Map, BookOpen, Settings, ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
  { title: "Ranqueado", url: "/ranked", icon: Trophy },
];

const metaItems = [
  { title: "Coleção", url: "/collection", icon: BookOpen },
  { title: "Loja", url: "/store", icon: ShoppingCart },
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
  const { user, logout } = useAuth();

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
      <SidebarFooter className="border-t border-sidebar-border/60 p-4">
        {!collapsed && user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.nickname} 
                  className="h-9 w-9 rounded-lg object-cover border border-primary/20 shadow-glow-sm"
                />
              ) : (
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center font-display font-black text-primary text-xs shadow-glow-sm">
                  {user.nickname.substring(0, 2)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  {user.clan_tag && (
                    <span className="text-[10px] font-display font-black text-primary transition-all shrink-0">
                      [{user.clan_tag}]
                    </span>
                  )}
                  <span className="font-display text-xs font-black truncate uppercase tracking-tight text-white/90">
                    {user.nickname}
                  </span>
                </div>
                <span className="text-[9px] font-display font-black text-muted-foreground uppercase opacity-40">
                  {user.rank} // {user.mmr} MMR
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity">
               <span className="text-[9px] font-display font-black tracking-widest text-muted-foreground uppercase">v0.1 PRE-ALPHA</span>
               <button onClick={logout} className="hover:text-red-500 transition-colors">
                  <LogOut className="h-3.5 w-3.5" />
               </button>
            </div>
          </div>
        ) : (
          !collapsed && (
            <div className="text-[10px] font-display tracking-widest text-muted-foreground">
              v0.1 · PRE-ALPHA
            </div>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
