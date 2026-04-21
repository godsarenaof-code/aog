import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, Zap, Shield, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const traits = [
  "Ciborgue", "Holográfico", "Ascendente", "Sindicato", "Deidade",
  "Lâmina", "Sentinela", "Tecnomago", "Atirador", "Bastion"
];

export function EncyclopediaSection() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedChamp, setSelectedChamp] = useState<any | null>(null);

  // Fetch Champions from Supabase
  const { data: champions = [], isLoading } = useQuery({
    queryKey: ['champions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('champions')
        .select('*')
        .order('tier', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Show only 5 featured champions on the landing page
  const featuredChampions = champions.slice(0, 5);

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
        {traits.map(t => (
          <Badge
            key={t}
            className={`cursor-pointer px-4 py-2 text-sm font-display tracking-widest ${activeFilter === t ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border-border hover:bg-primary/20 hover:text-primary'}`}
            onClick={() => setActiveFilter(t)}
          >
            {t.toUpperCase()}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
        {isLoading ? (
           Array(5).fill(0).map((_, i) => (
             <div key={i} className="panel flex flex-col items-center p-4 animate-pulse opacity-50">
               <div className="w-24 h-24 bg-card rounded-xl mb-4" />
               <div className="h-4 w-20 bg-card rounded mb-2" />
               <div className="h-3 w-32 bg-card rounded" />
             </div>
           ))
        ) : featuredChampions.map((champ: any) => {
          const isFaded = activeFilter !== null && !champ.classes?.includes(activeFilter) && !champ.origins?.includes(activeFilter);
          return (
            <div
              key={champ.id}
              onClick={() => setSelectedChamp(champ)}
              className={`panel flex flex-col items-center p-4 transition-all duration-300 cursor-pointer ${isFaded ? 'opacity-20 grayscale scale-95' : 'hover:-translate-y-2 hover:shadow-cyan-glow border-primary/20 bg-background/40 hover:bg-background/60'}`}
            >
              <div className={`w-24 h-24 bg-background rounded-xl border-2 mb-4 flex items-center justify-center font-display text-2xl font-bold uppercase overflow-hidden transition-transform group-hover:scale-105 ${getTierColor(champ.tier)}`}>
                 {champ.image_url ? (
                   <img src={champ.image_url} alt={champ.name} className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-muted-foreground/30 select-none">{champ.name.substring(0, 2)}</span>
                 )}
              </div>
              <h3 className="font-display text-lg mb-1">{champ.name}</h3>
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {[...(champ.origins || []), ...(champ.classes || [])].map((c: string) => (
                  <span key={c} className="text-[10px] uppercase font-display bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center line-clamp-2 mt-auto border-t border-border/40 pt-2 w-full">
                {champ.ability?.name || "Habilidade Especial"}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Link to="/champions">
          <Button variant="outline" size="lg" className="border-cyan/40 text-cyan hover:bg-cyan/10 font-display tracking-[0.2em] group">
            VER TODOS OS CAMPEÕES
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

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
                    "{selectedChamp?.description || "A guardiã da Arena observa, aguardando o chamado dos deuses para a batalha final."}"
                 </p>
                 
                 <Button onClick={() => setSelectedChamp(null)} className="w-full bg-primary text-black font-display font-bold tracking-widest mt-4">
                    VOLTAR PARA A MATRIZ
                 </Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
