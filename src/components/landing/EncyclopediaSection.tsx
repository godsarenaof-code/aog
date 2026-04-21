import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const champions = [
  { id: "kael", name: "Kael", tier: 1, classes: ["Ciborgue", "Lâmina"], ability: "Corte Biônico (Dano + Sangramento)" },
  { id: "zane", name: "Zane", tier: 3, classes: ["Ciborgue", "Lâmina", "Sindicato"], ability: "Turbilhão de Créditos" },
  { id: "luna", name: "Luna", tier: 4, classes: ["Holográfico", "Atirador", "Tecnomago"], ability: "Lua Binária" },
  { id: "zeus", name: "Zeus-01", tier: 5, classes: ["Deidade", "Tecnomago"], ability: "Julgamento Binário" },
];

const classesList = ["Ciborgue", "Lâmina", "Tecnomago", "Holográfico", "Sindicato", "Atirador", "Deidade"];

export function EncyclopediaSection() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return "border-gray-500 shadow-[0_0_10px_gray]";
      case 2: return "border-green-500 shadow-[0_0_10px_green]";
      case 3: return "border-blue-500 shadow-[0_0_10px_blue]";
      case 4: return "border-purple-500 shadow-[0_0_10px_purple]";
      case 5: return "border-yellow-500 shadow-[0_0_10px_yellow]";
      default: return "border-gray-500";
    }
  };

  return (
    <section id="encyclopedia" className="container py-24 border-t border-border/40">
      <div className="text-center mb-16 space-y-3">
        <div className="text-xs font-display tracking-[0.4em] text-accent">// ENCICLOPÉDIA</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">MATRIZ DE <span className="text-cyan">CAMPEÕES</span></h2>
        <p className="text-muted-foreground pt-2">Conheça algumas das lendas que guerreiam na Arena.</p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Badge 
          className={`cursor-pointer px-4 py-2 text-sm font-display tracking-widest ${activeFilter === null ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-primary/20 hover:text-primary'}`}
          onClick={() => setActiveFilter(null)}
        >
          TODOS
        </Badge>
        {classesList.map(cls => (
          <Badge 
            key={cls}
            className={`cursor-pointer px-4 py-2 text-sm font-display tracking-widest ${activeFilter === cls ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border-border hover:bg-primary/20 hover:text-primary'}`}
            onClick={() => setActiveFilter(cls)}
          >
            {cls.toUpperCase()}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {champions.map((champ) => {
          const isFaded = activeFilter !== null && !champ.classes.includes(activeFilter);
          return (
            <div 
              key={champ.id} 
              className={`panel flex flex-col items-center p-4 transition-all duration-300 ${isFaded ? 'opacity-20 grayscale scale-95' : 'hover:-translate-y-2 hover:shadow-glow'}`}
            >
              <div className={`w-20 h-20 bg-background rounded-full border-2 mb-4 flex items-center justify-center font-display text-2xl font-bold uppercase overflow-hidden ${getTierColor(champ.tier)}`}>
                 <span className="text-muted-foreground/30 select-none">{champ.name.substring(0, 2)}</span>
              </div>
              <h3 className="font-display text-lg mb-1">{champ.name}</h3>
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {champ.classes.map(c => (
                  <span key={c} className="text-[10px] uppercase font-display bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center line-clamp-2 mt-auto border-t border-border/40 pt-2 w-full">
                {champ.ability}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
