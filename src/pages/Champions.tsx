import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Sparkles, Crown, Coins, Droplet, X, Search, Loader2, Zap } from "lucide-react";
import { origins, classes } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const tierConfig = {
  1: { color: "text-muted-foreground", border: "border-muted", bg: "bg-muted/20", label: "T1" },
  2: { color: "text-success", border: "border-success/60", bg: "bg-success/10", label: "T2" },
  3: { color: "text-cyan", border: "border-cyan/60", bg: "bg-cyan/10", label: "T3" },
  4: { color: "text-accent", border: "border-accent/60", bg: "bg-accent/10", label: "T4" },
  5: { color: "text-gold", border: "border-gold/60", bg: "bg-gradient-gold/10", label: "T5" },
} as const;

type Trait = { name: string; kind: "origin" | "class"; icon: any; levels?: string; desc: string };
const allTraits: Trait[] = [
  ...origins.map((o) => ({ name: o.name, kind: "origin" as const, icon: o.icon, levels: o.levels, desc: o.desc })),
  ...classes.map((c) => ({ name: c.name, kind: "class" as const, icon: c.icon, levels: c.levels, desc: c.desc })),
];

const renderIcon = (icon: any, className = "h-4 w-4") => {
  if (!icon) return null;
  if (typeof icon === "string") return <span>{icon}</span>;
  const Icon = icon;
  return <Icon className={className} />;
};

const Champions = () => {
  const [active, setActive] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChamp, setSelectedChamp] = useState<any | null>(null);

  const { data: dbChampions, isLoading } = useQuery({
    queryKey: ['champions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('champions').select('*');
      if (error) throw error;
      return data;
    }
  });

  const champions = Array.isArray(dbChampions) ? dbChampions : [];

  const filtered = useMemo(() => {
    if (!active && !searchTerm) return champions;
    return champions.filter(
      (c) => {
        const matchesTrait = !active || c.origins?.includes(active) || c.classes?.includes(active);
        const matchesSearch = !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTrait && matchesSearch;
      }
    );
  }, [active, searchTerm, champions]);

  const grouped = [1, 2, 3, 4, 5].map((t) => ({
    tier: t as 1 | 2 | 3 | 4 | 5,
    units: filtered.filter((c) => c.tier === t),
  }));

  const activeTrait = useMemo(() => {
    if (!active) return null;
    const o = origins.find((x) => x.name === active);
    if (o) return { ...o, kind: "origin" as const };
    const c = classes.find((x) => x.name === active);
    if (c) return { ...c, kind: "class" as const };
    return null;
  }, [active]);

  return (
    <div className="min-h-screen overflow-x-hidden pb-12">
      <Navbar />

      <section className="relative pt-32 pb-12">
        <div className="container space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs font-display tracking-[0.3em] text-primary">
            <Crown className="h-3 w-3" />
            ELENCO COMPLETO
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black leading-[1.05]">
            <span className="text-cyan text-glow uppercase">{champions.length > 0 ? `${champions.length} Deuses da Arena` : 'Os Deuses Estão Chegando'}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Conheça as unidades, sinergias e estratégias. Combine origens e classes para forjar composições devastadoras e dominar os tiers.
          </p>
          <div className="flex gap-8 pt-4 text-sm">
            <div><div className="font-display text-2xl text-cyan">{champions.length}</div><div className="text-muted-foreground uppercase text-[10px] tracking-widest">Unidades</div></div>
            <div><div className="font-display text-2xl text-cyan">{origins.length}</div><div className="text-muted-foreground uppercase text-[10px] tracking-widest">Origens</div></div>
            <div><div className="font-display text-2xl text-cyan">{classes.length}</div><div className="text-muted-foreground uppercase text-[10px] tracking-widest">Classes</div></div>
          </div>
        </div>
      </section>

      <section className="container py-12 space-y-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="font-display text-xs tracking-widest text-muted-foreground animate-pulse">SINCRONIZANDO COM O OLIMPO...</p>
          </div>
        ) : (
          <>
            <div className="panel p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs tracking-[0.3em] text-primary uppercase">// Filtrar Sinergias</span>
                <div className="flex items-center gap-4">
                   <div className="relative hidden sm:block">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="BUSCAR DEUS..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-background border border-border/40 rounded px-8 py-1 text-[10px] font-display tracking-widest focus:outline-none focus:border-primary/60 w-48 transition-all"
                      />
                   </div>
                   {active && (
                    <button
                      onClick={() => setActive(null)}
                      className="flex items-center gap-1 text-xs font-display tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3 w-3" /> LIMPAR
                    </button>
                  )}
                </div>
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
                      {renderIcon(t.icon)}
                      {t.name.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeTrait && (
              <div className={`panel p-5 border-2 ${activeTrait.kind === "origin" ? "border-primary/60 bg-primary/5" : "border-accent/60 bg-accent/5"}`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl shrink-0">{renderIcon(activeTrait.icon, "h-10 w-10")}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className={`font-display text-2xl ${activeTrait.kind === "origin" ? "text-primary" : "text-accent"}`}>
                        {activeTrait.name.toUpperCase()}
                      </h3>
                      <span className="font-display text-[10px] tracking-widest px-2 py-1 rounded bg-muted/30 text-muted-foreground">
                        {activeTrait.kind === "origin" ? "ORIGEM" : "CLASSE"}
                      </span>
                      {activeTrait.levels && (
                        <span className="font-display text-[10px] tracking-widest px-2 py-1 rounded bg-cyan/10 text-cyan border border-cyan/30">
                          NÍVEIS {activeTrait.levels}
                        </span>
                      )}
                      <span className="font-display text-[10px] tracking-widest px-2 py-1 rounded bg-muted/30 text-muted-foreground">
                        {filtered.length} {filtered.length === 1 ? "UNIDADE DISPONÍVEL" : "UNIDADES DISPONÍVEIS"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activeTrait.desc}</p>
                  </div>
                </div>
              </div>
            )}

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
                    onClick={() => setSelectedChamp(u)}
                    className={`panel p-5 hover:shadow-cyan-glow transition-all hover:-translate-y-1 cursor-pointer group ${cfg.border}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`h-16 w-16 rounded-md overflow-hidden bg-card border-2 ${cfg.border} shadow-lg transition-transform group-hover:scale-105`}>
                        {u.image_url ? (
                          <img src={u.image_url} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full ${tier >= 4 ? "bg-gradient-gold" : "bg-gradient-primary"} grid place-items-center`}>
                            <span className="font-display text-2xl font-black text-primary-foreground select-none">
                              {u.name[0]}
                            </span>
                          </div>
                        )}
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
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{u.description}</p>
                    {u.ability && typeof u.ability === 'object' && (
                      <div className="border-t border-border/60 pt-3 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Sparkles className="h-3 w-3 text-cyan shrink-0" />
                            <span className="font-display text-xs text-cyan truncate">{(u.ability as any).name}</span>
                          </div>
                          <span className="flex items-center gap-1 text-[10px] font-display text-primary shrink-0">
                            <Droplet className="h-3 w-3" />{(u.ability as any).mana}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">{(u.ability as any).effect}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        );
      })}
        </>
      )}
      </section>

      {/* MODAL CINEMÁTICO DO DEUS */}
      <Dialog open={!!selectedChamp} onOpenChange={(open) => !open && setSelectedChamp(null)}>
        <DialogContent className="max-w-4xl bg-background/95 border-primary/20 p-0 overflow-hidden backdrop-blur-xl">
           <div className="grid lg:grid-cols-2">
              <div className="relative aspect-[3/4] lg:aspect-auto h-[400px] lg:h-[600px] bg-card overflow-hidden">
                 {selectedChamp?.action_image_url ? (
                   <img src={selectedChamp.action_image_url} className="w-full h-full object-cover animate-fade-in" />
                 ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground/20 font-display text-8xl font-black">A.O.G</div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
              
              <div className="p-8 flex flex-col justify-center space-y-6">
                 <div>
                    <div className="text-[10px] font-display tracking-[0.4em] text-cyan mb-2">// ARQUIVO DO DEUS</div>
                    <DialogTitle className="font-display text-5xl font-black uppercase tracking-tighter">
                       {selectedChamp?.name}
                    </DialogTitle>
                    <div className="flex gap-2 mt-2">
                       {selectedChamp?.origins?.map((o: string) => <Badge key={o} variant="outline" className="border-primary/40 text-primary">{o}</Badge>)}
                       {selectedChamp?.classes?.map((c: string) => <Badge key={c} variant="outline" className="border-accent/40 text-accent">{c}</Badge>)}
                    </div>
                 </div>
                 
                 <div className="panel p-4 bg-muted/20 border-primary/10">
                    <div className="flex items-center gap-2 text-primary font-display text-xs mb-2 tracking-widest">
                       <Zap className="h-3 w-3" /> HABILIDADE: {selectedChamp?.ability?.name}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                       {selectedChamp?.ability?.effect || selectedChamp?.description}
                    </p>
                 </div>
                 
                 <p className="text-xs text-muted-foreground italic leading-relaxed">
                    "{selectedChamp?.description || "Uma lenda da arena aguarda o chamado para a batalha final."}"
                 </p>
                 
                 <Button onClick={() => setSelectedChamp(null)} className="w-full bg-primary text-black font-display font-bold tracking-widest mt-4">
                    VOLTAR PARA A LISTAGEM
                 </Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border/40 py-8 text-center text-xs font-display tracking-widest text-muted-foreground">
        © 2026 ARENA OF GODS
      </footer>
    </div>
  );
};

export default Champions;
