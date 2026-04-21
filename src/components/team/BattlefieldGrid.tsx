import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sword, Shield, Zap, Target, Sparkles } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface PlacedUnit {
  id: string; // tempId
  position: Position;
  champion: any;
}

interface BattlefieldGridProps {
  team: any[];
  onPositionChange?: (placedUnits: PlacedUnit[]) => void;
}

export function BattlefieldGrid({ team, onPositionChange }: BattlefieldGridProps) {
  const [placedUnits, setPlacedUnits] = useState<PlacedUnit[]>([]);
  const [selectedFromBench, setSelectedFromBench] = useState<any | null>(null);

  const COLS = 7;
  const ROWS = 8; // 4 fileiras para o jogador, 4 para o inimigo
  const MAX_ON_BOARD = 8;
  const TEAM_LIMIT = 16;

  // Ensure placed units are still in team
  const validPlacedUnits = useMemo(() => {
    return placedUnits.filter(pu => team.some(t => t.tempId === pu.id));
  }, [placedUnits, team]);

  const handleCellClick = (x: number, y: number) => {
    if (y < 4) return; // Top half is enemy/visual only

    const existingIndex = validPlacedUnits.findIndex(pu => pu.position.x === x && pu.position.y === y);

    if (existingIndex !== -1) {
      // Remove unit from grid
      const newPlaced = [...validPlacedUnits];
      newPlaced.splice(existingIndex, 1);
      setPlacedUnits(newPlaced);
      onPositionChange?.(newPlaced);
      return;
    }

    if (selectedFromBench) {
      // Check if unit is already placed elsewhere
      const unitIndex = validPlacedUnits.findIndex(pu => pu.id === selectedFromBench.tempId);
      
      if (unitIndex === -1 && validPlacedUnits.length >= MAX_ON_BOARD) {
        // Enforce board limit
        // Omit toast for now as it's a subcomponent, but could pass it via props or use central toast
        return;
      }

      const newPlaced = [...validPlacedUnits];
      const newUnit: PlacedUnit = {
        id: selectedFromBench.tempId,
        position: { x, y },
        champion: selectedFromBench
      };

      if (unitIndex !== -1) {
        // Move unit
        newPlaced[unitIndex] = newUnit;
      } else {
        // Place new unit
        newPlaced.push(newUnit);
      }

      setPlacedUnits(newPlaced);
      onPositionChange?.(newPlaced);
      setSelectedFromBench(null);
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return "border-slate-500";
      case 2: return "border-emerald-500";
      case 3: return "border-blue-500";
      case 4: return "border-purple-500";
      case 5: return "border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
      default: return "border-muted";
    }
  };

  return (
    <div className="space-y-8">
      {/* Battlefield Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between max-w-[500px] mx-auto">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-[10px] tracking-[0.3em] uppercase text-primary">Campo de Batalha (7x4)</h4>
            <Badge variant="outline" className={`text-[9px] ${validPlacedUnits.length >= MAX_ON_BOARD ? 'border-amber-500 text-amber-500 shadow-glow-amber' : 'border-primary/40 text-primary'}`}>
              {validPlacedUnits.length} / {MAX_ON_BOARD} UNIDADES
            </Badge>
          </div>
          <div className="text-[9px] font-display text-muted-foreground uppercase tracking-tighter opacity-40 italic">
            Zona de Conflito Ativa
          </div>
        </div>

        <div className="relative aspect-[7/8] w-full max-w-[500px] mx-auto bg-black/60 border-2 border-primary/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] backdrop-blur-xl p-2 grid grid-cols-7 grid-rows-8 gap-1">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-7 grid-rows-8 italic opacity-10 leading-none overflow-hidden">
           {Array.from({ length: 56 }).map((_, i) => (
             <div key={i} className="border-[1px] border-primary/30 flex items-center justify-center text-[6px]">AOG_{i}</div>
           ))}
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10" />

        {Array.from({ length: ROWS }).map((_, y) => (
          Array.from({ length: COLS }).map((_, x) => {
            const unit = validPlacedUnits.find(pu => pu.position.x === x && pu.position.y === y);
            const isEnemySide = y < 4;
            const isSelectedCell = selectedFromBench && !isEnemySide && !unit;

            return (
              <div 
                key={`${x}-${y}`}
                onClick={() => handleCellClick(x, y)}
                className={`relative rounded-sm border transition-all duration-300 flex items-center justify-center group overflow-hidden ${
                  isEnemySide 
                    ? "bg-red-500/10 border-red-500/20 cursor-default" 
                    : unit 
                      ? "bg-primary/20 border-primary cursor-pointer hover:shadow-cyan-glow shadow-sm"
                      : isSelectedCell
                        ? "bg-cyan/40 border-white cursor-pointer animate-pulse shadow-glow-sm"
                        : "bg-primary/10 border-primary/30 cursor-pointer hover:bg-primary/20 hover:border-primary"
                }`}
              >
                {/* Cell Coordinate Label */}
                <div className="absolute top-0.5 right-1 text-[5px] opacity-20 uppercase font-mono">
                  {String.fromCharCode(65 + x)}{y + 1}
                </div>

                {unit && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    key={unit.id}
                    className="w-full h-full p-1"
                  >
                    <div className={`w-full h-full rounded-sm border-2 overflow-hidden bg-background ${getTierColor(unit.champion.tier)} transition-transform group-hover:scale-105`}>
                      {unit.champion.image_url ? (
                        <img src={unit.champion.image_url} alt={unit.champion.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-display text-[10px] font-bold opacity-40">
                          {unit.champion.name[0]}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Adversário Visual (Static/Fake) */}
                {isEnemySide && y === 1 && (x === 1 || x === 3 || x === 5) && !unit && (
                   <div className="w-full h-full p-1 opacity-20 grayscale sepia">
                      <div className="w-full h-full rounded-sm border border-red-500/40 bg-red-950/20 flex items-center justify-center">
                         <Sword className="h-3 w-3 text-red-500" />
                      </div>
                   </div>
                )}
              </div>
            );
          })
        ))}
      </div>

      {/* Bench Selection UI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <h4 className="font-display text-[10px] tracking-[0.3em] uppercase text-cyan">BANCO DE POSICIONAMENTO</h4>
           {selectedFromBench && (
             <button 
               onClick={() => setSelectedFromBench(null)}
               className="text-[10px] font-display text-red-400 hover:text-red-500 tracking-widest"
             >
                [ CANCELAR SELEÇÃO ]
             </button>
           )}
        </div>

        <div className="flex flex-wrap gap-3 p-4 bg-black/20 border border-primary/10 rounded-lg min-h-[80px]">
          {team.length === 0 ? (
            <div className="w-full flex items-center justify-center text-[10px] font-display tracking-widest text-muted-foreground opacity-40 italic">
              SELECIONE HERÓIS NO ARSENAL ABAIXO
            </div>
          ) : (
            <div className="flex flex-col w-full gap-4">
              <div className="flex flex-wrap gap-3">
                {team.map((champ) => {
                  const isPlaced = validPlacedUnits.some(pu => pu.id === champ.tempId);
                  const isSelected = selectedFromBench?.tempId === champ.tempId;

                  return (
                    <button
                      key={champ.tempId}
                      onClick={() => setSelectedFromBench(champ)}
                      className={`relative group transition-all duration-300 ${isPlaced ? 'opacity-40 grayscale pointer-events-none' : 'hover:-translate-y-1'}`}
                    >
                      <div className={`h-12 w-12 rounded border-2 overflow-hidden bg-background transition-all ${
                        isSelected ? 'border-cyan shadow-glow-sm scale-110' : getTierColor(champ.tier)
                      }`}>
                        {champ.image_url ? (
                          <img src={champ.image_url} alt={champ.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-display font-bold">
                            {champ.name[0]}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 border-2 border-cyan animate-pulse rounded" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                 <div className="text-[9px] font-display text-muted-foreground uppercase tracking-widest">
                    Heróis no Banco: <span className="text-foreground">{team.length - validPlacedUnits.length} / 8</span>
                 </div>
                 <div className="text-[9px] font-display text-muted-foreground uppercase tracking-widest">
                    Inventário Total: <span className="text-foreground">{team.length} / 16</span>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
