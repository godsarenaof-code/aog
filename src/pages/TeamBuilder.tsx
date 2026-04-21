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
      case 1: return "border-muted text-muted-foreground bg-muted/10";
      case 2: return "border-success text-success bg-success/10";
      case 3: return "border-cyan text-cyan bg-cyan/10";
      case 4: return "border-accent text-accent bg-accent/10";
      case 5: return "border-gold text-gold bg-gold/10";
      default: return "border-white";
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
               
               {/* Selected Team Bench */}
               <div className="panel p-6 bg-black/40 border-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Sword className="h-24 w-24" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="font-display text-sm tracking-[0.3em] uppercase">Sua Composição ({team.length}/{teamLimit})</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3 min-h-[100px]">
                     <AnimatePresence>
                        {team.map((champ) => (
                           <motion.div
                             layout
                             initial={{ opacity: 0, scale: 0.5 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.5 }}
                             key={champ.tempId}
                             className="relative group"
                           >
                              <div className={`aspect-square rounded-lg border-2 overflow-hidden bg-background shadow-lg transition-transform hover:scale-105 ${getTierColor(champ.tier)}`}>
                                 {champ.image_url ? (
                                   <img src={champ.image_url} alt={champ.name} className="w-full h-full object-cover" />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center font-display text-xl font-bold bg-muted/20">
                                      {champ.name[0]}
                                   </div>
                                 )}
                              </div>
                              <button 
                                onClick={() => removeFromTeam(champ.tempId)}
                                className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                              >
                                 ✕
                              </button>
                              <div className="text-[8px] font-display text-center mt-1 truncate opacity-60 uppercase">{champ.name}</div>
                           </motion.div>
                        ))}
                        {Array.from({ length: Math.max(0, 10 - team.length) }).map((_, i) => (
                           <div key={`empty-${i}`} className="aspect-square rounded-lg border border-dashed border-border/20 flex items-center justify-center opacity-20">
                              <Plus className="h-4 w-4" />
                           </div>
                        ))}
                     </AnimatePresence>
                  </div>
               </div>

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

                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {filteredChamps.map((champ: any) => (
                       <motion.button
                         whileHover={{ y: -5 }}
                         whileTap={{ scale: 0.95 }}
                         key={champ.id}
                         onClick={() => addToTeam(champ)}
                         className={`panel p-3 text-left group border-border/40 hover:border-cyan/40 bg-card/40 transition-all ${getTierColor(champ.tier)} bg-opacity-5`}
                       >
                          <div className="flex items-start justify-between mb-3">
                             <div className={`h-12 w-12 rounded border-2 shadow-inner overflow-hidden ${getTierColor(champ.tier)}`}>
                                {champ.image_url ? (
                                   <img src={champ.image_url} alt={champ.name} className="w-full h-full object-cover" />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center font-display font-black opacity-30">{champ.name[0]}</div>
                                )}
                             </div>
                             <div className="text-[10px] font-display font-bold">{champ.tier}G</div>
                          </div>
                          <h4 className="font-display text-xs font-bold truncate uppercase">{champ.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-2">
                             {[...(champ.origins || []), ...(champ.classes || [])].slice(0, 2).map((t: string) => (
                                <span key={t} className="text-[7px] font-display tracking-widest bg-background/60 px-1 border border-border/20 rounded uppercase">
                                   {t}
                                </span>
                             ))}
                          </div>
                       </motion.button>
                    ))}
                 </div>
               </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
