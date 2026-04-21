import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { TraitTracker } from "@/components/team/TraitTracker";
import { 
  Users, Trash2, Plus, Sword, Shield, Target, Sparkles, Flame, Zap, RefreshCw, 
  ChevronRight, Info, Search, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BattlefieldGrid } from "@/components/team/BattlefieldGrid";
import { ChampionCard } from "@/components/team/ChampionCard";
import { PROGRESSION } from "@/lib/rankUtils";

export default function TeamBuilder() {
  const [team, setTeam] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const teamLimit = 10;

  const { data: champions, isLoading: champsLoading } = useQuery({
    queryKey: ['champions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('champions').select('*').order('tier', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: traits, isLoading: traitsLoading } = useQuery({
    queryKey: ['traits'],
    queryFn: async () => {
      const { data, error } = await supabase.from('traits').select('*');
      if (error) throw error;
      return data;
    }
  });

  const addToTeam = (champ: any) => {
    if (team.length >= teamLimit) {
      toast.error(`Limite de ${teamLimit} unidades atingido!`);
      return;
    }
    setTeam([...team, { ...champ, tempId: Math.random() }]);
  };

  const removeFromTeam = (tempId: number) => {
    setTeam(team.filter(c => c.tempId !== tempId));
  };

  const clearTeam = () => {
    setTeam([]);
    toast.success("Campo de batalha limpo!");
  };

  const filteredChamps = champions?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return "border-slate-500/30 text-slate-400 bg-slate-500/5";
      case 2: return "border-emerald-500/30 text-emerald-400 bg-emerald-500/5";
      case 3: return "border-cyan/30 text-cyan bg-cyan/5";
      case 4: return "border-purple-500/30 text-purple-400 bg-purple-500/5";
      case 5: return "border-amber-500/50 text-amber-400 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
      default: return "border-border/40 text-muted-foreground bg-muted/5";
    }
  };

  const isLoading = champsLoading || traitsLoading;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="container pt-32 space-y-12 animate-fade-in px-4 md:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs font-display tracking-[0.3em] text-primary">
                <Users className="h-3 w-3" /> SIMULADOR DE COMBATE
             </div>
             <h1 className="font-display text-5xl md:text-6xl font-black leading-none uppercase tracking-tighter">
                Arena de <span className="text-cyan">Estratégia</span>
             </h1>
             <p className="text-muted-foreground text-sm uppercase font-display tracking-widest max-w-xl">
                Monte sua composição sagrada e calcule o poder das sinergias antes de entrar na arena.
             </p>
          </div>
          
          <div className="flex gap-4">
             <Button 
               variant="outline" 
               className="border-primary/20 hover:bg-primary/10 font-display tracking-widest text-[10px]"
               onClick={clearTeam}
             >
                <RefreshCw className="mr-2 h-3 w-3" /> RESETAR TIME
             </Button>
          </div>
        </div>

        {isLoading ? (
           <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <div className="text-[10px] font-display tracking-[0.5em] text-muted-foreground animate-pulse uppercase">Conectando ao Olimpo...</div>
           </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Panel: Sinergias (Fixed on Desktop) */}
            <div className="lg:col-span-3 space-y-8 sticky top-32">
               <TraitTracker team={team} traits={traits || []} />
               
               <div className="panel p-5 bg-primary/5 border-primary/10">
                  <div className="flex items-center gap-2 text-primary font-display text-[10px] tracking-widest mb-3">
                    <Info className="h-3 w-3" /> DICA TÁTICA
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                    Combine unidades da mesma **Origem** para bônus passivos e da mesma **Classe** para mecânicas de combate específicas.
                  </p>
               </div>
            </div>

            {/* Middle: Grid & Selection */}
            <div className="lg:col-span-9 space-y-8">
               
               {/* Battle Arena & Bench */}
               <BattlefieldGrid team={team} />

               {/* Champion Selection Grid */}
               <div className="space-y-6">
                 <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-sm tracking-[0.3em] uppercase shrink-0">Arsenal de Heróis</h3>
                    <div className="relative flex-1 max-w-sm">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <input 
                         type="text" 
                         placeholder="BUSCAR DEUS..." 
                         value={searchTerm}
                         onChange={e => setSearchTerm(e.target.value)}
                         className="w-full bg-muted/10 border border-border/40 rounded-full px-10 py-2 text-[10px] font-display tracking-widest focus:outline-none focus:border-cyan/60 transition-all uppercase"
                       />
                    </div>
                 </div>

                 <div className="space-y-12">
                    {[5, 4, 3, 2, 1].map(tier => {
                       const tierChamps = filteredChamps.filter(c => c.tier === tier);
                       if (tierChamps.length === 0) return null;

                       return (
                         <div key={tier} className="space-y-4">
                            <div className="flex items-center gap-4">
                               <h4 className={`font-display text-[10px] tracking-[0.5em] font-black py-1 px-4 rounded border ${
                                 tier === 5 ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                                 tier === 4 ? 'border-purple-500 text-purple-500 bg-purple-500/10' :
                                 tier === 3 ? 'border-primary text-primary bg-primary/10' :
                                 tier === 2 ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' :
                                 'border-slate-500 text-slate-500 bg-slate-500/10'
                               }`}>
                                 TIER {tier} ({tier}G)
                               </h4>
                               <div className="h-px flex-1 bg-border/20" />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                {tierChamps.map((champ: any) => (
                                  <ChampionCard 
                                    key={champ.id} 
                                    champion={champ} 
                                    onClick={() => addToTeam(champ)} 
                                  />
                                ))}
                             </div>
                         </div>
                       );
                    })}
                 </div>
               </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
