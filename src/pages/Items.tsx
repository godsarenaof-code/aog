import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { baseItems, combinedItems } from "@/lib/data";
import { Sword, Shield, Zap, Sparkles, Plus, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Items() {
  return (
    <div className="min-h-screen pb-24">
      <Navbar />

      <section className="relative pt-32 pb-12">
        <div className="container space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs font-display tracking-[0.3em] text-primary">
            <Sword className="h-3 w-3" />
            ARSENAL TECNOLÓGICO
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black leading-[1.05]">
            <span className="text-cyan text-glow uppercase">Itens & Forja</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Descubra as combinações que definem o meta. Equipe seus campeões com a tecnologia de ponta da Arena.
          </p>
          <Link to="/">
             <Button variant="outline" size="sm" className="border-primary/60 text-primary hover:bg-primary/10 font-display tracking-wider">
               <ChevronLeft className="h-4 w-4 mr-1" /> VOLTAR PARA HOME
             </Button>
          </Link>
        </div>
      </section>

      {/* COMPONENTES BASE */}
      <section className="container py-12 space-y-8">
        <div className="space-y-3">
          <div className="text-xs font-display tracking-[0.4em] text-accent">// COMPONENTES BASE</div>
          <h2 className="font-display text-3xl font-bold uppercase">Materiais <span className="text-cyan">Primários</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {baseItems.map((item) => (
            <div key={item.id} className="panel p-6 flex items-start gap-4 hover:border-primary/40 transition-colors">
              <div className="h-14 w-14 rounded bg-primary/10 border border-primary/30 shrink-0 grid place-items-center">
                <span className="font-display text-2xl text-primary font-black">{item.name[0]}</span>
              </div>
              <div>
                <h3 className="font-display text-xl mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ITENS COMBINADOS */}
      <section className="container py-12 space-y-8">
        <div className="space-y-3">
          <div className="text-xs font-display tracking-[0.4em] text-accent">// ITENS COMPLETOS</div>
          <h2 className="font-display text-3xl font-bold uppercase">Tecnologia <span className="text-gold">Avançada</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedItems.map((item) => {
            const recipeA = baseItems.find(b => b.id === item.recipe?.[0]);
            const recipeB = baseItems.find(b => b.id === item.recipe?.[1]);
            return (
              <div key={item.id} className="panel-glow p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl text-gold">{item.name}</h3>
                  <div className="h-12 w-12 rounded bg-gold/10 border border-gold/40 grid place-items-center">
                    <Zap className="h-5 w-5 text-gold" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                
                <div className="border-t border-border/40 pt-4 flex items-center gap-3">
                   <div className="text-[10px] font-display text-muted-foreground uppercase tracking-widest mr-2">Forja:</div>
                   <div className="flex items-center gap-2">
                      <div title={recipeA?.name} className="h-8 w-8 rounded border border-primary/20 bg-primary/5 grid place-items-center text-xs font-display text-primary">
                        {recipeA?.name[0]}
                      </div>
                      <Plus className="h-3 w-3 text-muted-foreground" />
                      <div title={recipeB?.name} className="h-8 w-8 rounded border border-primary/20 bg-primary/5 grid place-items-center text-xs font-display text-primary">
                        {recipeB?.name[0]}
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
