import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { baseItems, combinedItems, specialItems } from "@/lib/data";
import { Zap, Plus, ChevronLeft, Sparkles, Box, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Items() {
  return (
    <div className="min-h-screen pb-24">
      <Navbar />

      <section className="relative pt-32 pb-12">
        <div className="container space-y-4 animate-fade-in text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs font-display tracking-[0.3em] text-primary mx-auto md:mx-0">
            <Box className="h-3 w-3" />
            SISTEMA DE HARDWARE
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05]">
            <span className="text-cyan text-glow uppercase">Arsenal da Arena</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mx-auto md:mx-0">
            Domine a forja quântica. Arraste componentes, combine tecnologias e crie a vantagem definitiva para seus deuses.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            <Link to="/">
              <Button size="lg" variant="outline" className="border-primary/60 text-primary hover:bg-primary/10 font-display tracking-widest px-8">
                <ChevronLeft className="mr-2 h-4 w-4" /> VOLTAR PARA HOME
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* COMPONENTES BASE */}
      <section className="container py-12 space-y-10">
        <div className="flex items-center gap-4">
           <div className="h-px flex-1 bg-border/40" />
           <div className="text-xs font-display tracking-[0.4em] text-accent shrink-0 uppercase">// Componentes de Drop</div>
           <div className="h-px flex-1 bg-border/40" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {baseItems.map((item) => (
            <div key={item.id} className="panel p-6 flex flex-col items-center text-center gap-3 hover:border-primary/60 transition-all hover:shadow-glow group cursor-default">
              <div className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</div>
              <div>
                <h3 className="font-display text-sm mb-1 uppercase tracking-tighter">{item.name}</h3>
                <p className="text-[10px] text-muted-foreground font-display text-primary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ITENS ESPECIAIS */}
      <section className="container py-12">
        <div className="panel-glow p-8 bg-gradient-to-r from-gold/10 via-background to-gold/10 border-gold/30">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="text-6xl animate-pulse-glow rounded-full p-4">{specialItems[0].icon}</div>
              <h2 className="font-display text-2xl text-gold font-bold uppercase tracking-widest">{specialItems[0].name}</h2>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-gold/20 text-gold text-[10px] font-display tracking-widest">
                <Sparkles className="h-3 w-3" /> ITEM ÚNICO LENDÁRIO
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {specialItems[0].desc}
              </p>
              <div className="p-4 rounded border border-gold/20 bg-gold/5 text-xs text-gold/80 font-display italic">
                \"Este hardware divino cai apenas quando restam os 3 últimos jogadores. Ele consome o item atual e dobra todo o poder do Deus portador.\"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ITENS COMBINADOS */}
      <section className="container py-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <h2 className="font-display text-3xl font-bold uppercase">Tabela de <span className="text-cyan">Combinações</span></h2>
            <p className="text-sm text-muted-foreground font-display tracking-wider">TODOS OS 21 EQUIPAMENTOS FORJÁVEIS</p>
          </div>
          <div className="flex items-center gap-4 px-4 py-2 rounded bg-card/50 border border-border text-[10px] font-display text-muted-foreground uppercase">
             <Info className="h-3 w-3 text-accent" /> hardware permanente · reciclagem necessária para troca
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedItems.map((item) => {
            const recipeA = baseItems.find(b => b.id === item.recipe?.[0]);
            const recipeB = baseItems.find(b => b.id === item.recipe?.[1]);
            return (
              <div key={item.id} className="panel p-6 space-y-4 hover:border-primary/40 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{item.icon}</span>
                    <h3 className="font-display text-lg tracking-tight uppercase group-hover:text-cyan transition-colors">{item.name}</h3>
                  </div>
                  <Zap className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed h-10 line-clamp-2">
                  {item.desc}
                </p>
                
                <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                   <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-lg" title={recipeA?.name}>{recipeA?.icon}</span>
                      <Plus className="h-2 w-2 text-muted-foreground" />
                      <span className="text-lg" title={recipeB?.name}>{recipeB?.icon}</span>
                   </div>
                   <div className="h-px flex-1 bg-border/20" />
                   <div className="text-[10px] font-display text-primary tracking-tighter uppercase shrink-0">Hardware Forjado</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
