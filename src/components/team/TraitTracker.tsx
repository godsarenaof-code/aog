import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Sword, Shield, Target, Sparkles, Flame, Zap } from "lucide-react";

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
      if (totalLevels >= 4) return { bg: "bg-purple-500", text: "text-white", border: "border-purple-400", shadow: "shadow-[0_0_15px_rgba(168,85,247,0.4)]" };
      return { bg: "bg-amber-500", text: "text-black", border: "border-amber-400", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.4)]" };
    }
    
    if (activeLevel >= 2) return { bg: "bg-slate-300", text: "text-black", border: "border-slate-200" };
    return { bg: "bg-orange-700", text: "text-white", border: "border-orange-600" };
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
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={trait.name}
                  className={`panel p-3 border-l-4 transition-all ${isActive ? 'bg-card/40' : 'opacity-60'} ${
                    trait.activeLevel === trait.totalLevels ? 'border-l-amber-500' : 
                    isActive ? 'border-l-primary' : 'border-l-muted'
                  } ${shadow || ''}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${bg} ${text} ${shadow ? 'animate-pulse' : ''}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-display text-[11px] font-bold tracking-widest uppercase">
                          {trait.name}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {trait.levels.map((level: number, i: number) => {
                             const isLevelActive = trait.count >= level;
                             const isLast = i + 1 === trait.totalLevels;
                             return (
                               <div 
                                 key={i}
                                 className={`h-1.5 w-4 rounded-full transition-all ${
                                   isLevelActive 
                                     ? (isLast ? (trait.totalLevels >= 4 ? 'bg-purple-500' : 'bg-amber-500') : 'bg-primary') 
                                     : 'bg-muted/40'
                                 } ${isLevelActive && isLast ? 'shadow-[0_0_5px_currentColor]' : ''}`}
                               />
                             );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className={`font-display text-lg font-black ${trait.activeLevel === trait.totalLevels ? 'text-amber-500' : isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                         {trait.count}
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
