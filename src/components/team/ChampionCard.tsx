import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sword, Zap, Shield, Sparkles, Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChampionCardProps {
  champion: any;
  onClick?: () => void;
  className?: string;
}

export const ChampionCard: React.FC<ChampionCardProps> = ({ champion, onClick, className }) => {
  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'from-slate-500/20 to-slate-500/5 border-slate-500/30';
      case 2: return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30';
      case 3: return 'from-blue-500/20 to-blue-500/5 border-blue-500/30';
      case 4: return 'from-purple-500/20 to-purple-500/5 border-purple-500/30';
      case 5: return 'from-amber-500/30 to-amber-500/10 border-amber-500/50';
      default: return 'from-muted/20 to-muted/5 border-muted';
    }
  };

  const getTierTextShadow = (tier: number) => {
    if (tier === 5) return '0 0 15px rgba(245,158,11,0.5)';
    return 'none';
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
              relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300
              bg-gradient-to-br ${getTierColor(champion.tier)}
              ${champion.tier === 5 ? 'shadow-[0_0_25px_rgba(245,158,11,0.2)]' : 'shadow-lg'}
              ${className}
            `}
          >
            {/* Image Placeholder / Actual Image */}
            <div className="aspect-[4/5] relative overflow-hidden">
               {champion.image_url ? (
                 <img 
                   src={champion.image_url} 
                   alt={champion.name} 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-black/40">
                    <span className="text-4xl font-display font-black opacity-20">{champion.name[0]}</span>
                 </div>
               )}
               
               {/* Tier Tag */}
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                   <Badge variant="outline" className={`bg-black/60 backdrop-blur-md border-white/10 font-black px-2 py-0.5 text-[10px] ${champion.tier === 5 ? 'text-amber-400' : 'text-white'}`}>
                     {champion.tier}G
                   </Badge>
                   {champion.equippedSkin && (
                     <Badge className="bg-cyan/80 text-black border-none text-[8px] font-black uppercase tracking-tighter shadow-glow-sm">
                        SKIN ATIVA
                     </Badge>
                   )}
                </div>

               {/* Bottom Overlay Info */}
               <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-6">
                  <h4 className="font-display text-sm font-bold tracking-widest uppercase mb-1 truncate" style={{ textShadow: getTierTextShadow(champion.tier) }}>
                    {champion.name}
                  </h4>
                  <div className="flex gap-1.5 flex-wrap">
                     {[...(champion.origins || []), ...(champion.classes || [])].map((t: string) => (
                       <span key={t} className="text-[8px] font-display font-black tracking-widest bg-white/10 px-1.5 py-0.5 rounded border border-white/5 uppercase select-none">
                         {t}
                       </span>
                     ))}
                  </div>
               </div>
            </div>
            
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-150%] rotate-[25deg] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
          </motion.div>
        </TooltipTrigger>

        {/* AAA Character Card Tooltip */}
        <TooltipContent 
          side="right" 
          className="w-72 p-0 bg-background/95 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          <div className={`h-1.5 w-full bg-gradient-to-r ${champion.tier === 5 ? 'from-amber-500 to-yellow-300' : 'from-primary to-cyan'}`} />
          
          <div className="p-5 space-y-5">
             {/* Header */}
             <div className="flex items-start justify-between">
                <div>
                   <div className="text-[9px] font-display tracking-[0.3em] text-primary/80 mb-1 uppercase">// Perfil de Deus</div>
                   <h3 className="font-display text-xl font-black uppercase tracking-tighter">{champion.name}</h3>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10">
                   <Zap className="h-5 w-5 text-primary" />
                </div>
             </div>

             {/* Stats Grid */}
             <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 rounded-lg p-2 border border-white/5 flex flex-col items-center">
                   <Heart className="h-3 w-3 text-red-500 mb-1" />
                   <span className="text-xs font-display font-bold">{champion.hp || 700}</span>
                   <span className="text-[8px] text-muted-foreground uppercase tracking-widest">HP</span>
                </div>
                 <div className="bg-white/5 rounded-lg p-2 border border-white/5 flex flex-col items-center relative overflow-hidden group/stat">
                    <Sword className="h-3 w-3 text-orange-500 mb-1" />
                    <span className="text-xs font-display font-bold">
                      {Math.round((champion.attack || 120) * (1 + (champion.equippedSkin?.damage_bonus || 0) / 100))}
                    </span>
                    <span className="text-[8px] text-muted-foreground uppercase tracking-widest">ATK</span>
                    {champion.equippedSkin && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-[6px] px-1 font-black">+{champion.equippedSkin.damage_bonus}%</div>
                    )}
                 </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/5 flex flex-col items-center">
                   <Timer className="h-3 w-3 text-cyan-500 mb-1" />
                   <span className="text-xs font-display font-bold">{champion.speed || 1.3}</span>
                   <span className="text-[8px] text-muted-foreground uppercase tracking-widest">VEL</span>
                </div>
             </div>

             {/* Ability Box */}
             <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <Sparkles className="h-3 w-4 text-primary" />
                   <span className="text-[10px] font-display font-black tracking-widest uppercase">Habilidade</span>
                </div>
                <div className="panel p-3 bg-primary/5 border-primary/20 rounded-lg">
                   <div className="text-xs font-bold text-primary mb-1 uppercase">{(champion.ability as any)?.name || 'Golpe Sombrio'}</div>
                   <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                      "{(champion.ability as any)?.effect || 'Salta para trás do inimigo e causa 200% de dano crítico'}"
                   </p>
                </div>
             </div>

             {/* Traits Summary */}
             <div className="flex flex-wrap gap-2">
                {[...(champion.origins || []), ...(champion.classes || [])].map((t: string) => (
                  <div key={t} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10">
                     <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.5)]" />
                     <span className="text-[9px] font-display font-bold uppercase tracking-widest">{t}</span>
                  </div>
                ))}
             </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
