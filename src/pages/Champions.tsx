import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Crown, Sparkles, Coins, Droplet, X } from "lucide-react";
import logo from "@/assets/aog-logo.png";
import { champions, origins, classes } from "@/lib/data";
import { Navbar } from "@/components/Navbar";

const tierConfig = {
  1: { color: "text-muted-foreground", border: "border-muted", bg: "bg-muted/20", label: "T1" },
  2: { color: "text-success", border: "border-success/60", bg: "bg-success/10", label: "T2" },
  3: { color: "text-cyan", border: "border-cyan/60", bg: "bg-cyan/10", label: "T3" },
  4: { color: "text-accent", border: "border-accent/60", bg: "bg-accent/10", label: "T4" },
  5: { color: "text-gold", border: "border-gold/60", bg: "bg-gradient-gold/10", label: "T5" },
} as const;

const allTraits = [
  ...origins.map(o => ({ name: o.name, kind: "origin" as const, icon: o.icon })),
  ...classes.map(c => ({ name: c.name, kind: "class" as const, icon: "⚔️" })), // Default icon for classes if not specific
];

const Champions = () => {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? champions.filter((c) => c.origins.includes(active) || c.classes.includes(active)) : champions),
    [active]
  );

  const grouped = [1, 2, 3, 4, 5].map((t) => ({
    tier: t as 1 | 2 | 3 | 4 | 5,
    units: filtered.filter((c) => c.tier === t),
  }));

  return (
    <div className="min-h-screen overflow-x-hidden pb-12">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-12">
        <div className="container space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs font-display tracking-[0.3em] text-primary">
            <Crown className="h-3 w-3" />
            ELENCO COMPLETO
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black leading-[1.05]">
            <span className="text-cyan text-glow uppercase">22 Deuses da Arena</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Conheça as unidades, sinergias e estratégias do Pré-Alpha. Combine origens e classes
            para forjar composições devastadoras.
          </p>
          <div className="flex gap-8 pt-4 text-sm">
            <div><div className="font-display text-2xl text-cyan">22</div><div className="text-muted-foreground uppercase text-[10px] tracking-widest">Unidades</div></div>
            <div><div className="font-display text-2xl text-cyan">5</div><div className="text-muted-foreground uppercase text-[10px] tracking-widest">Origens</div></div>
            <div><div className="font-display text-2xl text-cyan">5</div><div className="text-muted-foreground uppercase text-[10px] tracking-widest">Classes</div></div>
          </div>
        </div>
      </section>

      {/* CAMPEÕES POR TIER */}
      <section className="container py-12 space-y-8">
        {/* FILTRO DE SINERGIAS */}
        <div className="panel p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs tracking-[0.3em] text-primary uppercase">// Filtrar Sinergias</span>
            {active && (
              <button
                onClick={() => setActive(null)}
                className="flex items-center gap-1 text-xs font-display tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" /> LIMPAR
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTraits.map((t) => {
              const isActive = active === t.name;
              const isOrigin = t.kind === "origin";
              return (
                <button
                  key={t.name}
                  onClick={() => setActive(isActive ? null : t.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-display text-xs tracking-wider border transition-all ${
                    isActive
                      ? isOrigin
                        ? "bg-primary/20 border-primary text-primary shadow-glow"
                        : "bg-accent/20 border-accent text-accent shadow-glow"
                      : isOrigin
                        ? "border-primary/30 text-primary/70 hover:border-primary/60 hover:text-primary"
                        : "border-accent/30 text-accent/70 hover:border-accent/60 hover:text-accent"
                  }`}
                >
                  <span className="text-sm">{t.icon}</span>
                  {t.name.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {grouped.filter((g) => g.units.length > 0).map(({ tier, units }) => {
          const cfg = tierConfig[tier];
          return (
            <div key={tier} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`font-display text-2xl font-bold ${cfg.color}`}>TIER {tier}</span>
                <div className={`h-px flex-1 ${cfg.border} border-t`} />
                <span className="font-display text-xs tracking-widest text-muted-foreground">
                  {units.length} {units.length === 1 ? "UNIDADE" : "UNIDADES"}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {units.map((u) => (
                  <div
                    key={u.id}
                    className={`panel p-5 hover:shadow-glow transition-all hover:-translate-y-1 ${cfg.border}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`h-14 w-14 rounded-md ${tier >= 4 ? "bg-gradient-gold" : "bg-gradient-primary"} grid place-items-center shadow-lg`}>
                        <span className="font-display text-2xl font-black text-primary-foreground select-none">
                          {u.name[0]}
                        </span>
                      </div>
                      <span className={`font-display text-[10px] tracking-widest px-2 py-1 rounded ${cfg.bg} ${cfg.color} flex items-center gap-1`}>
                        <Coins className="h-3 w-3" />{tier}
                      </span>
                    </div>
                    <h3 className="font-display text-lg mb-1">{u.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {u.origins.map((o) => (
                        <span key={o} className="text-[10px] font-display tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
                          {o}
                        </span>
                      ))}
                      {u.classes.map((c) => (
                        <span key={c} className="text-[10px] font-display tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/30">
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{u.desc}</p>
                    <div className="border-t border-border/60 pt-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Sparkles className="h-3 w-3 text-cyan shrink-0" />
                          <span className="font-display text-xs text-cyan truncate">{u.ability.name}</span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-display text-primary shrink-0">
                          <Droplet className="h-3 w-3" />{u.ability.mana}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">{u.ability.effect}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="border-t border-border/40 py-8 text-center text-xs font-display tracking-widest text-muted-foreground">
        © 2026 ARENA OF GODS
      </footer>
    </div>
  );
};

export default Champions;
