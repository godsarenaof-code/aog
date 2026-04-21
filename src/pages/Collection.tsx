import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import { Coins, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const units = Array.from({ length: 18 }).map((_, i) => ({
  name: ["Vex", "Nyx", "Orion", "Sera", "Kael", "Lyra", "Zeph", "Riven", "Aether"][i % 9] + " " + ((i % 3) + 1),
  cost: (i % 5) + 1,
  trait: ["Cibernético", "Arcano", "Vanguarda", "Caçador", "Místico"][i % 5],
  owned: i < 11,
}));

const tabs = ["Unidades", "Sinergias", "Itens", "Skins"];

const Collection = () => {
  const [tab, setTab] = useState(0);
  return (
    <AppLayout>
      <div className="container max-w-7xl py-8 space-y-6 animate-fade-in">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-display tracking-[0.4em] text-accent">// COLEÇÃO</div>
            <h1 className="font-display text-4xl font-bold mt-2">CODEX DOS <span className="text-cyan">DEUSES</span></h1>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-9 bg-card/60 border-border/60" />
          </div>
        </div>

        <div className="flex gap-1 border-b border-border/60">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-5 py-2.5 font-display text-sm tracking-widest transition-colors relative ${
                tab === i ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.toUpperCase()}
              {tab === i && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary shadow-glow" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {units.map((u, i) => (
            <div
              key={i}
              className={`panel p-3 transition-all ${u.owned ? "hover:border-primary/60 hover:shadow-glow" : "opacity-40 grayscale"}`}
            >
              <div className={`aspect-square rounded mb-2 grid place-items-center ${u.cost >= 4 ? "bg-gradient-gold" : "bg-gradient-primary"}`}>
                <span className="font-display text-3xl font-bold text-primary-foreground/90">{u.name[0]}</span>
              </div>
              <div className="font-display text-sm">{u.name}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted-foreground tracking-wider">{u.trait}</span>
                <span className="flex items-center gap-1 text-xs text-accent font-display">
                  <Coins className="h-3 w-3" />{u.cost}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Collection;
