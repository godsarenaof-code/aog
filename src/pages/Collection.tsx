import { AppLayout } from "@/components/AppLayout";
import { Coins, Search, Sparkles, RefreshCcw, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const units = Array.from({ length: 18 }).map((_, i) => ({
  name: ["Vex", "Nyx", "Orion", "Sera", "Kael", "Lyra", "Zeph", "Riven", "Aether"][i % 9] + " " + ((i % 3) + 1),
  cost: (i % 5) + 1,
  trait: ["Cibernético", "Arcano", "Vanguarda", "Caçador", "Místico"][i % 5],
  owned: i < 11,
}));

const tabs = ["Unidades", "Sinergias", "Itens", "Firmwares"];

const RerollSlot = ({ id, onRemove }: { id?: string; onRemove: () => void }) => (
  <div className={`h-24 w-24 rounded-2xl border-2 flex items-center justify-center transition-all relative group/slot ${
    id ? "border-cyan/50 bg-cyan/10 shadow-glow" : "border-white/10 bg-white/5 opacity-40"
  }`}>
     {id ? (
       <>
         <Layers className="h-8 w-8 text-cyan" />
         <button 
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/slot:opacity-100 transition-opacity"
         >
           <RefreshCcw className="h-3 w-3" />
         </button>
       </>
     ) : (
       <div className="h-1 w-8 bg-white/10 rounded-full" />
     )}
  </div>
);

const Collection = () => {
  const [tab, setTab] = useState(0);
  const [allSkins, setAllSkins] = useState<any[]>([]);
  const [mySkins, setMySkins] = useState<any[]>([]);
  const [selectedRerollIds, setSelectedRerollIds] = useState<string[]>([]);
  const [isRerolling, setIsRerolling] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem('aog_token');
    if (!token) return;
    
    // Buscar todas as skins do catálogo
    const allRes = await fetch('http://localhost:3001/api/store/skins'); 
    if (allRes.ok) setAllSkins(await allRes.json());

    // Buscar skins do usuário
    const res = await fetch('http://localhost:3001/api/store/my-skins', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setMySkins(await res.json());
  };

  useEffect(() => {
    if (tab === 3) fetchData();
  }, [tab]);

  const toggleRerollSelection = (skinId: string) => {
    if (selectedRerollIds.includes(skinId)) {
      setSelectedRerollIds(prev => prev.filter(id => id !== skinId));
    } else if (selectedRerollIds.length < 3) {
      setSelectedRerollIds(prev => [...prev, skinId]);
    }
  };

  const handleReroll = async () => {
    if (selectedRerollIds.length !== 3) return;
    setIsRerolling(true);
    try {
      const token = localStorage.getItem('aog_token');
      const res = await fetch('http://localhost:3001/api/store/reroll', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ skinIds: selectedRerollIds })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      setSelectedRerollIds([]);
      fetchSkins();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsRerolling(false);
    }
  };

  const handleEquip = async (skinId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar disparar o reroll ao clicar em equipar
    try {
      const token = localStorage.getItem('aog_token');
      const res = await fetch('http://localhost:3001/api/store/equip-skin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ skinId })
      });
      if (res.ok) {
        toast.success("Skin equipada!");
        fetchSkins();
      }
    } catch (err) {
      toast.error("Erro ao equipar.");
    }
  };

  return (
    <AppLayout>
      <div className="container max-w-7xl py-8 space-y-6 animate-fade-in pb-24">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-display tracking-[0.4em] text-accent font-black">// COLLECTION</div>
            <h1 className="font-display text-4xl font-black mt-2 italic uppercase tracking-tighter">CODEX DOS <span className="text-cyan">DEUSES</span></h1>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar herói ou skin..." className="pl-9 bg-card/40 border-white/5 text-xs font-display uppercase tracking-widest" />
          </div>
        </div>

        <div className="flex gap-4 border-b border-white/5">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-4 py-3 font-display text-[10px] tracking-[0.3em] transition-all relative font-black uppercase ${
                tab === i ? "text-cyan" : "text-muted-foreground/60 hover:text-white"
              }`}
            >
              {t}
              {tab === i && <motion.span layoutId="tab-underline" className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan shadow-glow" />}
            </button>
          ))}
        </div>

        {tab === 3 ? (
          <div className="space-y-12">
            {/* Oficina de Recombinação de Código (Triangular) */}
            <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-black/40 backdrop-blur-3xl group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05),transparent_70%)]" />
               
               <div className="z-10 text-center space-y-2 absolute top-8">
                  <div className="flex items-center justify-center gap-2 text-cyan font-display text-[10px] tracking-widest font-black uppercase">
                     <RefreshCcw className="h-4 w-4 animate-spin-slow" /> OFICINA DE RECOMBINAÇÃO DE CÓDIGO
                  </div>
                  <h2 className="font-display text-2xl font-black uppercase italic tracking-tighter">Funda Fragmentos de Firmware</h2>
               </div>

               {/* Triangle Layout */}
               <div className="relative w-64 h-64 mt-12">
                  <AnimatePresence>
                     {isRerolling && (
                       <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 10, opacity: [0, 1, 0] }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-white rounded-full z-50 pointer-events-none"
                       />
                     )}
                  </AnimatePresence>

                  {/* Vertices */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <RerollSlot id={selectedRerollIds[0]} onRemove={() => toggleRerollSelection(selectedRerollIds[0])} />
                  </div>
                  <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2">
                      <RerollSlot id={selectedRerollIds[1]} onRemove={() => toggleRerollSelection(selectedRerollIds[1])} />
                  </div>
                  <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">
                      <RerollSlot id={selectedRerollIds[2]} onRemove={() => toggleRerollSelection(selectedRerollIds[2])} />
                  </div>

                  {/* Center Core */}
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-32 w-32 rounded-full border border-cyan/20 bg-cyan/5 flex items-center justify-center group-hover:border-cyan/40 transition-colors">
                         <Button 
                            variant="ghost" 
                            onClick={handleReroll}
                            disabled={selectedRerollIds.length < 3 || isRerolling}
                            className="h-28 w-28 rounded-full flex flex-col gap-1 items-center justify-center font-display font-black tracking-widest text-xs text-cyan hover:bg-cyan/10 disabled:opacity-20 z-20 group-hover:scale-110 transition-transform"
                          >
                             <Sparkles className="h-6 w-6" />
                             {isRerolling ? 'FUNDINDO' : 'FIMWARE'}
                          </Button>
                      </div>
                  </div>

                  {/* Connecting Lines */}
                  <svg className="absolute inset-0 -z-10 w-full h-full opacity-20" viewBox="0 0 100 100">
                     <path d="M50 10 L10 90 L90 90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan animate-pulse" />
                  </svg>
               </div>
            </div>

            {/* Skins Grid (Album Style) */}
            <div className="space-y-6">
              <h3 className="font-display text-sm tracking-widest uppercase opacity-40">Galeria de Firmwares (Álbum)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allSkins.map((s) => {
                  const userOwned = mySkins.find(ms => ms.skin_id === s.id);
                  const isEquipped = userOwned?.is_equipped;
                  const isSelected = selectedRerollIds.includes(s.id);
                  const count = userOwned?.count || 0;

                  return (
                    <motion.div
                      key={s.id}
                      layout
                      whileHover={userOwned ? { scale: 1.05 } : {}}
                      onClick={() => userOwned && toggleRerollSelection(s.id)}
                      className={`panel p-3 relative overflow-hidden transition-all ${
                        !userOwned ? "opacity-20 grayscale cursor-not-allowed border-white/5" : 
                        isSelected ? "border-cyan shadow-glow cursor-pointer" : 
                        "border-white/5 hover:border-white/20 cursor-pointer"
                      }`}
                    >
                      <div className={`aspect-square rounded-lg mb-3 grid place-items-center relative bg-black/40 border border-white/5`}>
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                         <span className="font-display text-4xl font-black text-white/10 z-0">{s.name[0]}</span>
                         
                         <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                           <div>
                            <div className={`text-[8px] font-display font-black tracking-widest uppercase ${
                              s.rarity === 'Divino' ? 'text-amber-400' : s.rarity === 'Épico' ? 'text-purple-400 font-glow' : 'text-primary'
                            }`}>
                              {s.rarity}
                            </div>
                            <div className="text-[10px] font-display font-bold text-white truncate max-w-[80px]">{s.name}</div>
                           </div>
                           {userOwned && (
                             <div className="h-5 w-5 rounded bg-black/60 border border-white/10 flex items-center justify-center text-[9px] font-display font-black">
                               x{count}
                             </div>
                           )}
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] text-muted-foreground uppercase tracking-widest truncate max-w-[60px]">{s.champion_name}</span>
                         <div className="flex items-center gap-1">
                            {userOwned ? (
                             <div className="flex items-center gap-1">
                                {isEquipped ? (
                                  <span className="text-[8px] font-display font-black text-cyan shadow-glow-sm uppercase">Equipado</span>
                                ) : (
                                  <button onClick={(e) => handleEquip(s.id, e)} className="text-[8px] font-display font-black text-white/40 hover:text-cyan uppercase">[ ATIVAR ]</button>
                                )}
                             </div>
                            ) : (
                              <span className="text-[8px] font-display font-black text-white/20 uppercase tracking-tighter">Bloqueado</span>
                            )}
                         </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-cyan text-black rounded-full p-0.5 shadow-glow">
                          <Layers className="h-3 w-3" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {units.map((u, i) => (
              <div
                key={i}
                className={`panel p-3 transition-all ${u.owned ? "hover:border-primary/60 hover:shadow-glow" : "opacity-40 grayscale"}`}
              >
                <div className={`aspect-square rounded mb-2 grid place-items-center ${u.cost >= 4 ? "bg-gradient-gold" : "bg-gradient-primary"}`}>
                  <span className="font-display text-3xl font-bold text-primary-foreground/90">{u.name[0]}</span>
                </div>
                <div className="font-display text-sm">{u.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground tracking-wider">{u.trait}</span>
                  <span className="flex items-center gap-1 text-xs text-accent font-display">
                    <Coins className="h-3 w-3" />{u.cost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Collection;
