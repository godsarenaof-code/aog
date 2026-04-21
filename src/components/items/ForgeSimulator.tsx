import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Plus, Zap, RefreshCw, Box, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ForgeSimulator() {
  const [slot1, setSlot1] = useState<string | null>(null);
  const [slot2, setSlot2] = useState<string | null>(null);
  const [isFusing, setIsFusing] = useState(false);
  const [fusionResult, setFusionResult] = useState<string | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('items').select('*');
      if (error) throw error;
      return data;
    }
  });

  const baseItems = items?.filter(i => i.type === 'base') || [];
  const combinedItems = items?.filter(i => i.type === 'combined') || [];

  const handleReset = () => {
    setSlot1(null);
    setSlot2(null);
    setFusionResult(null);
    setIsFusing(false);
  };

  const handleForge = () => {
    if (!slot1 || !slot2) return;
    
    setIsFusing(true);
    
    // Simulate fusion time
    setTimeout(() => {
      const result = combinedItems.find(item => 
        (item.recipe?.[0] === slot1 && item.recipe?.[1] === slot2) ||
        (item.recipe?.[0] === slot2 && item.recipe?.[1] === slot1)
      );
      setFusionResult(result?.slug || null);
      setIsFusing(false);
    }, 800);
  };

  const selectedA = baseItems.find(i => i.slug === slot1);
  const selectedB = baseItems.find(i => i.slug === slot2);
  const resultItem = combinedItems.find(i => i.slug === fusionResult);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center panel bg-black/40 border-primary/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 py-12 px-6 panel bg-black/40 border-primary/20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="text-center space-y-2 relative z-10">
        <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">Mesa de Forja Quântica</h3>
        <p className="text-sm text-muted-foreground font-display">Clique nos componentes para carregar os núcleos de fusão.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 items-center relative z-10">
        
        {/* Inventário de Componentes */}
        <div className="space-y-4">
          <div className="text-[10px] font-display text-primary tracking-widest uppercase mb-2">Comandos de Drop</div>
          <div className="grid grid-cols-2 gap-3">
            {baseItems.map((item) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={item.slug}
                onClick={() => {
                  if (!slot1) setSlot1(item.slug);
                  else if (!slot2) setSlot2(item.slug);
                }}
                disabled={!!fusionResult || isFusing}
                className={`flex items-center gap-3 p-3 rounded border transition-all text-left ${
                  (slot1 === item.slug || slot2 === item.slug) 
                    ? 'border-primary bg-primary/10 shadow-glow text-primary' 
                    : 'border-border bg-card/50 text-muted-foreground hover:border-primary/40'
                } disabled:opacity-50`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-display font-bold leading-tight uppercase">{item.name}</span>
              </motion.button>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-[10px] font-display tracking-widest text-muted-foreground hover:text-primary transition-colors"
            onClick={handleReset}
          >
            <RefreshCw className="h-3 w-3 mr-2" /> REINICIAR FORJA
          </Button>
        </div>

        {/* Área de Fusão */}
        <div className="flex flex-col items-center gap-6 py-8">
           <div className="flex items-center gap-4">
              {/* Slot 1 */}
              <div className="relative">
                <motion.div 
                  className={`h-24 w-24 rounded-lg border-2 border-dashed flex items-center justify-center text-4xl transition-all ${
                    slot1 ? 'border-primary bg-primary/5 shadow-glow' : 'border-border bg-black/20'
                  }`}
                  animate={slot1 ? { scale: [1, 1.05, 1] } : {}}
                >
                  {selectedA?.icon || <Box className="h-8 w-8 opacity-10" />}
                </motion.div>
                {slot1 && (
                  <button 
                    onClick={() => setSlot1(null)}
                    className="absolute -top-2 -right-2 h-5 w-5 bg-background border border-border rounded-full flex items-center justify-center text-[10px] hover:text-red-500"
                  >✕</button>
                )}
              </div>

              <Plus className="h-6 w-6 text-muted-foreground/40" />

              {/* Slot 2 */}
              <div className="relative">
                <motion.div 
                  className={`h-24 w-24 rounded-lg border-2 border-dashed flex items-center justify-center text-4xl transition-all ${
                    slot2 ? 'border-primary bg-primary/5 shadow-glow' : 'border-border bg-black/20'
                  }`}
                  animate={slot2 ? { scale: [1, 1.05, 1] } : {}}
                >
                  {selectedB?.icon || <Box className="h-8 w-8 opacity-10" />}
                </motion.div>
                {slot2 && (
                  <button 
                    onClick={() => setSlot2(null)}
                    className="absolute -top-2 -right-2 h-5 w-5 bg-background border border-border rounded-full flex items-center justify-center text-[10px] hover:text-red-500"
                  >✕</button>
                )}
              </div>
           </div>

           <Button 
            onClick={handleForge}
            disabled={!slot1 || !slot2 || isFusing || !!fusionResult}
            className={`w-full max-w-[200px] h-14 font-display text-lg tracking-[0.2em] transition-all duration-500 ${
              slot1 && slot2 && !fusionResult ? 'bg-primary text-black shadow-glow animate-pulse' : 'bg-muted opacity-50'
            }`}
           >
             {isFusing ? "FUSIONAR..." : "FORJAR"}
           </Button>
        </div>

        {/* Resultado */}
        <div className="relative flex flex-col items-center justify-center min-h-[250px] rounded-xl border border-primary/20 bg-card/30 backdrop-blur-sm overflow-hidden group">
           <AnimatePresence mode="wait">
             {isFusing ? (
               <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="flex flex-col items-center gap-4"
               >
                 <Zap className="h-12 w-12 text-primary animate-bounce shadow-glow" />
                 <span className="text-[10px] font-display text-primary tracking-[0.5em] animate-pulse">SISTEMA ATIVO</span>
               </motion.div>
             ) : resultItem ? (
               <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-6 space-y-4"
               >
                 <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded border border-gold/40 bg-gold/5 text-gold text-[9px] font-display tracking-widest uppercase mb-2">
                   Hardware Criado
                 </div>
                 <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">{resultItem.icon}</div>
                 <h4 className="font-display text-2xl text-cyan font-bold tracking-widest uppercase">{resultItem.name}</h4>
                 <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] mx-auto opacity-80">{resultItem.description}</p>
                 <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 border-primary/40 text-primary hover:bg-primary/5 text-[10px] tracking-widest h-8"
                  onClick={handleReset}
                 >
                   NOVA FORJA
                 </Button>
               </motion.div>
             ) : (
               <div key="empty" className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                 <Zap className="h-16 w-16" />
                 <span className="text-[10px] font-display tracking-[0.3em] uppercase">Vácuo Quântico</span>
               </div>
             )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
