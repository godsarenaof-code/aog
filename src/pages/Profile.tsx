import { AppLayout } from "@/components/AppLayout";
import { Trophy, TrendingUp, Crown, Swords } from "lucide-react";

const stats = [
  { label: "Top 4", value: "63%", icon: Trophy, color: "accent" },
  { label: "Vitórias", value: "147", icon: Crown, color: "primary" },
  { label: "Partidas", value: "412", icon: Swords, color: "primary" },
  { label: "MMR", value: "2,840", icon: TrendingUp, color: "accent" },
];

const matches = [
  { rank: 1, comp: "Cibernéticos", duration: "32m", lp: "+24" },
  { rank: 3, comp: "Arcanos", duration: "28m", lp: "+8" },
  { rank: 5, comp: "Vanguarda", duration: "24m", lp: "-12" },
  { rank: 2, comp: "Caçadores", duration: "30m", lp: "+18" },
  { rank: 7, comp: "Místicos", duration: "18m", lp: "-22" },
];

const Profile = () => (
  <AppLayout>
    <div className="container max-w-6xl py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="panel-glow p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="h-28 w-28 rounded-full bg-gradient-primary border-2 border-primary/60 shadow-glow grid place-items-center font-display text-3xl font-bold">
          TR
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="text-xs font-display tracking-[0.3em] text-accent">DIVINO III</div>
          <h1 className="font-display text-3xl font-bold mt-1">Aether_Prime</h1>
          <p className="text-muted-foreground text-sm mt-1">Invocador desde 2026 · Servidor BR</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-display tracking-widest text-muted-foreground">RANKING GLOBAL</div>
          <div className="font-display text-3xl text-cyan">#1,247</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="panel p-5">
            <div className={`h-10 w-10 rounded grid place-items-center mb-3 ${s.color === "accent" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="font-display text-2xl">{s.value}</div>
            <div className="text-xs text-muted-foreground tracking-widest mt-1">{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Match history */}
      <div>
        <h2 className="font-display text-xl tracking-widest text-muted-foreground mb-4">HISTÓRICO RECENTE</h2>
        <div className="panel divide-y divide-border/40">
          {matches.map((m, i) => (
            <div key={i} className="flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors">
              <div className={`h-12 w-12 rounded grid place-items-center font-display text-xl font-bold ${
                m.rank === 1 ? "bg-gradient-gold text-accent-foreground" :
                m.rank <= 4 ? "bg-primary/20 text-primary" :
                "bg-muted text-muted-foreground"
              }`}>
                #{m.rank}
              </div>
              <div className="flex-1">
                <div className="font-display text-sm">{m.comp}</div>
                <div className="text-xs text-muted-foreground">{m.duration} · Ranked</div>
              </div>
              <div className={`font-display text-lg ${m.lp.startsWith("+") ? "text-success" : "text-destructive"}`}>
                {m.lp} LP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Profile;
