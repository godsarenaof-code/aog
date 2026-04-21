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
        const levels = trait.levels.split('/').map((l: string) => parseInt(l.trim()));
        
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
              const isMax = trait.activeLevel === trait.totalLevels && trait.activeLevel > 0;
              const isActive = trait.activeLevel > 0;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={trait.name}
                  className={`panel p-3 border-l-4 transition-all ${
                    isMax ? 'border-l-gold bg-gold/5 shadow-glow-sm' : 
                    isActive ? 'border-l-primary bg-primary/5' : 
                    'border-l-muted bg-muted/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded flex items-center justify-center ${
                        isMax ? 'bg-gold text-black' : 
                        isActive ? 'bg-primary text-black' : 
                        'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-display text-[11px] font-bold tracking-widest uppercase">
                          {trait.name}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {trait.levels.map((level: number, i: number) => (
                            <div 
                              key={i}
                              className={`h-1.5 w-4 rounded-full ${
                                trait.count >= level 
                                  ? (i + 1 === trait.totalLevels ? 'bg-gold' : 'bg-primary') 
                                  : 'bg-muted/40'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className={`font-display text-lg font-black ${isMax ? 'text-gold' : isActive ? 'text-primary' : 'text-muted-foreground'}`}>
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
