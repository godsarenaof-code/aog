import { Trophy, TrendingUp, Crown, Swords } from "lucide-react";
import { getRankFromLp } from "@/lib/rankUtils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const stats = [
  { label: "Top 4", value: "63%", icon: Trophy, color: "accent" },
  { label: "Vitórias", value: "147", icon: Crown, color: "primary" },
  { label: "Partidas", value: "412", icon: Swords, color: "primary" },
  { label: "MMR", value: "2,840", icon: TrendingUp, color: "accent" },
];

const matches = [
  { rank: 1, comp: "Cibernéticos", duration: "32m", lp: "+8" },
  { rank: 3, comp: "Arcanos", duration: "28m", lp: "+6" },
  { rank: 5, comp: "Vanguarda", duration: "24m", lp: "-2" },
  { rank: 2, comp: "Caçadores", duration: "30m", lp: "+7" },
  { rank: 8, comp: "Místicos", duration: "18m", lp: "-5" },
];

const Profile = () => {
  // Simulação de dados do usuário (em um app real viria do DB)
  const userLp = 450; // Exemplo: Divino
  const rank = getRankFromLp(userLp);

  const stats = [
    { label: "Top 4", value: "63%", icon: Trophy, color: "accent" },
    { label: "Vitórias", value: "147", icon: Crown, color: "primary" },
    { label: "Partidas", value: "412", icon: Swords, color: "primary" },
    { label: "LP Atual", value: userLp.toString(), icon: TrendingUp, color: "accent" },
  ];

  return (
    <AppLayout>
      <div className="container max-w-6xl py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="panel-glow p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/60 shadow-glow grid place-items-center font-display text-4xl">
            {rank.icon}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className={`text-xs font-display tracking-[0.3em] font-black ${rank.color} uppercase`}>
              {rank.full}
            </div>
            <h1 className="font-display text-4xl font-black mt-1 uppercase tracking-tighter italic">Aether_Prime</h1>
            <p className="text-muted-foreground text-[10px] tracking-widest uppercase mt-1">Invocador desde 2026 · Servidor BR</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-display tracking-widest text-muted-foreground uppercase opacity-60">Ranking Global</div>
            <div className="font-display text-3xl text-cyan font-black italic">#1,247</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="panel p-5 bg-card/40 border-white/5">
              <div className={`h-10 w-10 rounded-lg grid place-items-center mb-3 ${s.color === "accent" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-2xl font-black">{s.value}</div>
              <div className="text-[10px] text-muted-foreground tracking-widest mt-1 uppercase font-bold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Match history */}
        <div>
          <h2 className="font-display text-sm tracking-[0.4em] text-muted-foreground mb-6 uppercase">// Histórico Recente</h2>
          <div className="panel divide-y divide-border/40 overflow-hidden">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-4 p-5 hover:bg-primary/5 transition-all group">
                <div className={`h-12 w-12 rounded-lg grid place-items-center font-display text-xl font-black transition-transform group-hover:scale-110 ${
                  m.rank === 1 ? "bg-gradient-to-br from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/20" :
                  m.rank <= 4 ? "bg-primary/20 text-primary border border-primary/20" :
                  "bg-muted/40 text-muted-foreground grayscale"
                }`}>
                  #{m.rank}
                </div>
                <div className="flex-1">
                  <div className="font-display text-xs font-bold tracking-widest uppercase">{m.comp}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.duration} · Ranked Match</div>
                </div>
                <div className={`font-display text-lg font-black italic ${m.lp.startsWith("+") ? "text-primary" : "text-destructive"}`}>
                  {m.lp} LP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
