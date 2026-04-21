import { AppLayout } from "@/components/AppLayout";
import { Coins, Heart, Zap, Users, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

// 8x4 hex board
const ROWS = 4;
const COLS = 7;

const shop = [
  { name: "Vex", cost: 1, color: "primary" },
  { name: "Nyx", cost: 2, color: "accent" },
  { name: "Orion", cost: 3, color: "primary" },
  { name: "Sera", cost: 4, color: "accent" },
  { name: "Kael", cost: 5, color: "primary" },
];

const synergies = [
  { name: "Cibernéticos", count: 4, tier: "Ouro" },
  { name: "Vanguarda", count: 2, tier: "Bronze" },
  { name: "Arcanos", count: 3, tier: "Prata" },
];

const Match = () => (
  <AppLayout>
    <div className="container max-w-7xl py-6 space-y-6 animate-fade-in">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 panel p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center font-display text-sm font-bold">L7</div>
            <div>
              <div className="font-display text-sm">Nível 7</div>
              <div className="text-xs text-muted-foreground">XP 14/20</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            <span className="font-display text-xl">68</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-accent" />
            <span className="font-display text-xl text-accent">42</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-display tracking-widest text-muted-foreground">RODADA 4-2</div>
          <div className="px-4 py-2 rounded bg-primary/10 border border-primary/40 font-display text-sm text-primary animate-pulse">
            COMBATE EM 0:18
          </div>
        </div>
      </div>

      {/* Synergies + Board */}
      <div className="grid lg:grid-cols-[200px_1fr] gap-6">
        <aside className="panel p-4 space-y-3">
          <div className="text-xs font-display tracking-widest text-muted-foreground">SINERGIAS ATIVAS</div>
          {synergies.map((s) => (
            <div key={s.name} className="flex items-center justify-between p-2 rounded bg-card/60 border border-border/40">
              <div>
                <div className="font-display text-sm">{s.name}</div>
                <div className="text-[10px] text-muted-foreground">{s.tier}</div>
              </div>
              <div className="font-display text-lg text-primary">{s.count}</div>
            </div>
          ))}
        </aside>

        {/* Hex board */}
        <div className="panel p-6 overflow-hidden">
          <div className="flex flex-col items-center gap-1">
            {Array.from({ length: ROWS }).map((_, r) => (
              <div key={r} className={`flex gap-1 ${r % 2 === 1 ? "ml-7" : ""}`}>
                {Array.from({ length: COLS }).map((_, c) => {
                  const occupied = (r === 3 && (c === 1 || c === 3 || c === 5)) || (r === 2 && c === 4);
                  return (
                    <div
                      key={c}
                      className={`relative w-14 h-16 clip-hex grid place-items-center cursor-pointer transition-all ${
                        occupied
                          ? "bg-gradient-primary shadow-glow"
                          : "bg-card/60 border border-primary/20 hover:bg-primary/10"
                      }`}
                    >
                      {occupied && <div className="font-display text-xs font-bold text-primary-foreground">U{c}</div>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bench */}
          <div className="mt-8">
            <div className="text-[10px] font-display tracking-widest text-muted-foreground mb-2">BANCO</div>
            <div className="flex gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={`w-14 h-14 rounded-md border ${i < 3 ? "bg-card/80 border-accent/40" : "bg-card/30 border-border/40 border-dashed"} grid place-items-center`}>
                  {i < 3 && <span className="font-display text-xs">U{i + 1}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shop */}
      <div className="panel p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-display tracking-widest text-muted-foreground">LOJA</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
              <RefreshCw className="h-3 w-3 mr-1" /> 2g
            </Button>
            <Button size="sm" variant="outline" className="border-accent/40 text-accent hover:bg-accent/10">
              <Zap className="h-3 w-3 mr-1" /> XP 4g
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground">
              <Lock className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {shop.map((u) => (
            <button key={u.name} className={`panel p-3 text-left hover:border-${u.color === "accent" ? "accent" : "primary"}/60 hover:shadow-glow transition-all group`}>
              <div className={`aspect-square rounded mb-2 ${u.color === "accent" ? "bg-gradient-gold" : "bg-gradient-primary"} opacity-80 group-hover:opacity-100 transition-opacity grid place-items-center`}>
                <Users className="h-8 w-8 text-primary-foreground/80" />
              </div>
              <div className="flex items-center justify-between">
                <div className="font-display text-sm">{u.name}</div>
                <div className={`flex items-center gap-1 text-xs font-display ${u.color === "accent" ? "text-accent" : "text-primary"}`}>
                  <Coins className="h-3 w-3" /> {u.cost}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Match;
