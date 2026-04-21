import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Mock das combinations (apenas um exemplo funcional do PRD)
const components = ["Espada", "Placa de Titânio", "Cristal de Mana"];

const combinations: Record<string, { result: string, desc: string }> = {
  "Espada+Placa de Titânio": { result: "Lâmina Suprema", desc: "Aumenta o Dano de Ataque em 20% e concede 10 de Armadura." },
  "Placa de Titânio+Espada": { result: "Lâmina Suprema", desc: "Aumenta o Dano de Ataque em 20% e concede 10 de Armadura." },
  "Espada+Espada": { result: "Lâmina Sangrenta", desc: "Ataques curam em 15% do dano causado." },
  "Placa de Titânio+Placa de Titânio": { result: "Armadura Reativa", desc: "Reflete 10% do dano recebido." },
  "Cristal de Mana+Cristal de Mana": { result: "Orbe do Paradoxo", desc: "Unidade inicia o combate com 50% do mana máximo." },
  "Espada+Cristal de Mana": { result: "Lâmina do Tecnomago", desc: "Ataques concedem +5 de poder mágico base." },
  "Cristal de Mana+Espada": { result: "Lâmina do Tecnomago", desc: "Ataques concedem +5 de poder mágico base." },
  "Placa de Titânio+Cristal de Mana": { result: "Escudo Cibernético", desc: "Ganha um escudo igual a 20% do max HP." },
  "Cristal de Mana+Placa de Titânio": { result: "Escudo Cibernético", desc: "Ganha um escudo igual a 20% do max HP." }
};

export function ArsenalSection() {
  const [itemA, setItemA] = useState<string>("Espada");
  const [itemB, setItemB] = useState<string>("Placa de Titânio");

  const combined = combinations[`${itemA}+${itemB}`];

  return (
    <section id="arsenal" className="container py-24 border-t border-border/40">
      <div className="text-center mb-16 space-y-3">
        <div className="text-xs font-display tracking-[0.4em] text-accent">// ARSENAL</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">SIMULADOR DE <span className="text-cyan">ITENS</span></h2>
        <p className="text-muted-foreground pt-2 max-w-2xl mx-auto">Equipe sua equipe com tecnologia de ponta combinando itens primários para conquistar a vitória.</p>
      </div>

      <div className="max-w-4xl mx-auto panel-glow p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Item A */}
        <div className="flex-1 w-full space-y-4">
          <label className="text-xs font-display tracking-widest text-muted-foreground uppercase">Componente A</label>
          <Select value={itemA} onValueChange={setItemA}>
            <SelectTrigger className="w-full bg-background border-primary/40 h-14 font-display">
              <SelectValue placeholder="Selecione um item" />
            </SelectTrigger>
            <SelectContent>
              {components.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Plus className="h-8 w-8 text-primary/50 shrink-0" />

        {/* Item B */}
        <div className="flex-1 w-full space-y-4">
          <label className="text-xs font-display tracking-widest text-muted-foreground uppercase">Componente B</label>
          <Select value={itemB} onValueChange={setItemB}>
            <SelectTrigger className="w-full bg-background border-primary/40 h-14 font-display">
              <SelectValue placeholder="Selecione um item" />
            </SelectTrigger>
            <SelectContent>
              {components.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <ArrowRight className="h-8 w-8 text-primary shrink-0 rotate-90 md:rotate-0" />

        {/* Result */}
        <div className="flex-[1.5] w-full border border-primary/40 p-6 rounded bg-primary/5 min-h-[120px] flex flex-col justify-center">
          {combined ? (
            <div className="animate-fade-in">
              <h4 className="font-display text-xl text-cyan mb-2 font-bold uppercase tracking-wide">{combined.result}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {combined.desc}
              </p>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm font-display tracking-widest text-center">
              COMBINAÇÃO DESCONHECIDA
            </div>
          )}
        </div>

      </div>

      <div className="flex justify-center mt-12">
        <Link to="/items">
          <Button variant="outline" size="lg" className="border-accent/40 text-accent hover:bg-accent/10 font-display tracking-[0.2em] group">
            VER TODOS OS ITENS E RECEITAS
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
