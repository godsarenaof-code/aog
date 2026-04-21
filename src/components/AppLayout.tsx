import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Coins, Gem, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState({ gold: 0, essence: 0 });

  const fetchBalance = async () => {
    const token = localStorage.getItem('aog_token');
    if (!token) return;
    const res = await fetch('http://localhost:3001/api/store/balance', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setBalance(await res.json());
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between gap-4 border-b border-border/60 bg-card/40 backdrop-blur-md px-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-primary hover:text-primary-glow" />
              <div className="hidden md:flex items-center gap-2 text-xs font-display tracking-[0.3em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                SERVIDOR ONLINE
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card/80 border border-border/60 hover:border-accent/40 transition-colors">
                <Coins className="h-4 w-4 text-accent" />
                <span className="font-display text-sm font-bold">{balance.gold.toLocaleString()}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 pr-1 rounded-md bg-card/80 border border-border/60 hover:border-primary/40 transition-colors group">
                <Gem className="h-4 w-4 text-primary" />
                <span className="font-display text-sm font-bold text-primary">{balance.essence.toLocaleString()}</span>
                <Link to="/store?tab=currency">
                  <Button size="icon" className="h-6 w-6 ml-2 bg-primary/20 hover:bg-primary text-primary hover:text-black transition-all rounded shadow-glow-sm">
                    <Plus className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Bell className="h-4 w-4" />
              </Button>
              <Link to="/profile">
                <div className="h-8 w-8 rounded-full bg-gradient-primary border border-primary/50 shadow-glow grid place-items-center text-xs font-display font-bold text-primary-foreground">
                  TR
                </div>
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
