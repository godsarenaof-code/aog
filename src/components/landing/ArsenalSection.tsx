import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Plus, ChevronRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { baseItems, combinedItems } from "@/lib/data";

export function ArsenalSection() {
  const [itemA, setItemA] = useState<string>(baseItems[0].id);
  const [itemB, setItemB] = useState<string>(baseItems[1].id);

  const combined = combinedItems.find(item => 
    (item.recipe?.[0] === itemA && item.recipe?.[1] === itemB) ||
    (item.recipe?.[0] === itemB && item.recipe?.[1] === itemA)
  );

  const selectedA = baseItems.find(i => i.id === itemA);
  const selectedB = baseItems.find(i => i.id === itemB);

  return (
    <section id="arsenal" className="container py-24 border-t border-border/40">
      <div className="text-center mb-16 space-y-3">
        <div className="text-xs font-display tracking-[0.4em] text-accent">// ARSENAL</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">Simulador de <span className="text-cyan">Itens</span></h2>
        <p className="text-muted-foreground pt-2 max-w-2xl mx-auto">Combine componentes base para forjar equipamentos destrutivos.</p>
      </div>

      <div className="max-w-4xl mx-auto panel-glow p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-primary/20">
        
        {/* Item A */}
        <div className="flex-1 w-full space-y-4">
          <label className="text-[10px] font-display tracking-widest text-muted-foreground uppercase flex items-center gap-2">
            Componente A {selectedA?.icon && <span>{selectedA.icon}</span>}
          </label>
          <Select value={itemA} onValueChange={setItemA}>
            <SelectTrigger className="w-full bg-background/50 border-primary/30 h-14 font-display">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/40 text-foreground">
              {baseItems.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name.toUpperCase()}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Plus className="h-8 w-8 text-primary/30 shrink-0" />

        {/* Item B */}
        <div className="flex-1 w-full space-y-4">
          <label className="text-[10px] font-display tracking-widest text-muted-foreground uppercase flex items-center gap-2">
            Componente B {selectedB?.icon && <span>{selectedB.icon}</span>}
          </label>
          <Select value={itemB} onValueChange={setItemB}>
            <SelectTrigger className="w-full bg-background/50 border-primary/30 h-14 font-display">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/40 text-foreground">
              {baseItems.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name.toUpperCase()}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <ArrowRight className="h-8 w-8 text-primary shrink-0 rotate-90 md:rotate-0" />

        {/* Result */}
        <div className="flex-[1.5] w-full border border-primary/40 p-6 rounded bg-primary/5 min-h-[140px] flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
             <Zap className="h-16 w-16 text-primary" />
          </div>
          {combined ? (
            <div className="animate-fade-in relative z-10">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-2xl">{combined.icon}</span>
                 <h4 className="font-display text-xl text-cyan font-bold uppercase tracking-wide leading-none">{combined.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {combined.desc}
              </p>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm font-display tracking-widest text-center animate-pulse">
              INCOMPATÍVEL
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 mt-12">
        <div className="flex flex-col md:flex-row items-center gap-4 px-6 py-4 rounded-lg bg-accent/5 border border-accent/20 max-w-3xl">
           <Info className="h-5 w-5 text-accent shrink-0" />
           <p className="text-sm text-accent/80 font-display tracking-wide text-center md:text-left leading-relaxed">
             <span className="font-bold text-accent">ESTRATÉGIA DE HARDWARE:</span> Itens são permanentes. Escolha com sabedoria quem receberá seus upgrades, pois o hardware só pode ser recuperado se o herói for reciclado (vendido).
           </p>
        </div>

        <Link to="/items">
          <Button variant="outline" size="lg" className="border-cyan/40 text-cyan hover:bg-cyan/10 font-display tracking-[0.2em] group min-w-[300px]">
            VER MANUAL COMPLETO DE ITENS
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
