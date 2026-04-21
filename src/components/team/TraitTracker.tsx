import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Sword, Shield, Target, Sparkles, Flame, Zap, Skull, Wind, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TraitTrackerProps {
  team: any[];
  traits: any[];
}

const traitIcons: Record<string, any> = {
  "Holográfico": Globe,
  "Ciborgue": Zap,
  "Ascendente": Sparkles,
  "Sindicato": Shield,
  "Deidade": Flame,
  "Lâmina": Sword,
  "Sentinela": Shield,
  "Tecnomago": Sparkles,
  "Atirador": Target,
  "Bastion": Flame,
  "Assassino": Skull,
  "Velocidade": Wind,
};

export function TraitTracker({ team, traits }: TraitTrackerProps) {
  const activeTraits = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Count traits from unique champions
    const uniqueIds = new Set();
    team.forEach(champ => {
      if (!uniqueIds.has(champ.id)) {
        uniqueIds.add(champ.id);
        const combined = [...(champ.origins || []), ...(champ.classes || [])];
        combined.forEach(traitName => {
          counts[traitName] = (counts[traitName] || 0) + 1;
        });
      }
    });

    return traits.map(trait => {
        const count = counts[trait.name] || 0;
        const levels = trait.levels?.split('/').map((l: string) => parseInt(l.trim())) || [];
        
        // Find current level
        let activeLevel = 0;
        levels.forEach((l: number, index: number) => {
            if (count >= l) activeLevel = index + 1;
        });

        return {
            ...trait,
            count,
            levels,
            activeLevel,
            totalLevels: levels.length
        };
    }).filter(t => t.count > 0).sort((a, b) => {
        if (a.activeLevel !== b.activeLevel) return b.activeLevel - a.activeLevel;
        return b.count - a.count;
    });
  }, [team, traits]);

  const getTraitColor = (activeLevel: number, totalLevels: number) => {
    if (activeLevel === 0) return { bg: "bg-muted", text: "text-muted-foreground", border: "border-muted" };
    
    if (activeLevel === totalLevels) {
      if (totalLevels >= 4) return { bg: "bg-purple-500", text: "text-white", border: "border-purple-400", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.6)]", glow: "celestial-glow-purple" };
      return { bg: "bg-amber-500", text: "text-black", border: "border-amber-400", shadow: "shadow-[0_0_20px_rgba(245,158,11,0.6)]", glow: "celestial-glow-gold" };
    }
    
    if (activeLevel >= 2) return { bg: "bg-slate-300", text: "text-black", border: "border-slate-200", glow: "celestial-glow-silver" };
    return { bg: "bg-orange-700", text: "text-white", border: "border-orange-600", glow: "celestial-glow-bronze" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h3 className="font-display text-sm tracking-[0.3em] text-primary uppercase">Sinergias Ativas</h3>
        <Badge variant="outline" className="text-[10px] opacity-60">{activeTraits.length} ATIVAS</Badge>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {activeTraits.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="py-12 text-center text-[10px] font-display tracking-widest uppercase"
            >
              Nenhuma sinergia detectada
            </motion.div>
          ) : (
            activeTraits.map((trait) => {
              const Icon = traitIcons[trait.name] || Globe;
              const { bg, text, border, shadow } = getTraitColor(trait.activeLevel, trait.totalLevels);
              const isActive = trait.activeLevel > 0;

              return (
                <TooltipProvider key={trait.name}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`panel p-3 border-l-4 relative overflow-hidden cursor-help transition-all ${isActive ? 'bg-card/40' : 'opacity-60'} ${
                          trait.activeLevel === trait.totalLevels ? 'border-l-amber-500 shadow-glow-amber' : 
                          isActive ? 'border-l-primary' : 'border-l-muted'
                        } ${shadow || ''} ${isActive ? 'animate-fade-in' : ''}`}
                      >
                        {/* Celestial Glow Effect Background */}
                        {isActive && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"
                          />
                        )}
                        
                        <div className="flex items-center justify-between gap-3 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-500 ${bg} ${text} ${isActive ? 'scale-110 shadow-lg' : ''}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-display text-[11px] font-black tracking-widest uppercase flex items-center gap-2">
                                {trait.name}
                                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />}
                              </div>
                              <div className="flex gap-1 mt-1.5">
                                {trait.levels.map((level: number, i: number) => {
                                   const isLevelActive = trait.count >= level;
                                   const isLast = i + 1 === trait.totalLevels;
                                   return (
                                     <div 
                                       key={i}
                                       className={`h-1 w-5 rounded-full transition-all duration-500 ${
                                         isLevelActive 
                                           ? (isLast ? (trait.totalLevels >= 4 ? 'bg-purple-500' : 'bg-amber-500') : 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]') 
                                           : 'bg-muted/30'
                                       }`}
                                     />
                                   );
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className={`font-display text-base font-black ${trait.activeLevel === trait.totalLevels ? 'text-amber-500' : isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                               {trait.count}
                               <span className="text-[10px] opacity-40 ml-1">/ {trait.levels[trait.activeLevel] || trait.levels[trait.totalLevels - 1]}</span>
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-background/95 backdrop-blur-xl border-primary/20 p-4 max-w-xs shadow-2xl">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-display font-black tracking-widest text-xs uppercase text-primary">{trait.name}</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-muted-foreground font-medium uppercase tracking-wider italic">
                          {trait.description || "Descrição não disponível."}
                        </p>
                        <div className="flex flex-col gap-1 pt-2 border-t border-white/5">
                           {trait.levels.map((lvl: number, idx: number) => (
                             <div key={idx} className={`flex items-center justify-between text-[9px] font-bold ${trait.count >= lvl ? 'text-primary' : 'text-muted-foreground opacity-40'}`}>
                               <span className="uppercase tracking-tighter">Nível {idx + 1}</span>
                               <span>{lvl} UNIDADES</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
