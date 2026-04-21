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

const tabs = ["Unidades", "Sinergias", "Itens", "Skins"];

const Collection = () => {
  const [tab, setTab] = useState(0);
  const [mySkins, setMySkins] = useState<any[]>([]);
  const [selectedRerollIds, setSelectedRerollIds] = useState<string[]>([]);
  const [isRerolling, setIsRerolling] = useState(false);

  const fetchSkins = async () => {
    const token = localStorage.getItem('aog_token');
    if (!token) return;
    const res = await fetch('http://localhost:3001/api/store/my-skins', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setMySkins(await res.json());
  };

  useEffect(() => {
    if (tab === 3) fetchSkins();
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
          <div className="space-y-10">
            {/* Reroll Area */}
            <div className="panel-glow p-8 bg-black/40 border-cyan/20 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="space-y-2 max-w-sm text-center md:text-left">
                  <div className="flex items-center gap-2 text-cyan font-display text-[10px] tracking-widest font-black uppercase mb-2">
                     <RefreshCcw className="h-4 w-4 animate-spin-slow" /> CENTRO DE FUSÃO CELESTIAL
                  </div>
                  <h2 className="font-display text-xl font-bold uppercase italic">Sacrifique Skins Repetidas</h2>
                  <p className="text-muted-foreground text-xs leading-relaxed opacity-60">Selecione 3 skins para tentar a sorte. Fusões de raridades altas têm mais chance de virem skins Divinas.</p>
               </div>

               <div className="flex items-center gap-4">
                  {[0, 1, 2].map(slot => (
                    <div key={slot} className={`h-20 w-20 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                      selectedRerollIds[slot] 
                        ? "border-cyan/50 bg-cyan/10 shadow-glow-sm" 
                        : "border-white/10 bg-white/5 opacity-40"
                    }`}>
                       {selectedRerollIds[slot] ? (
                         <Layers className="h-6 w-6 text-cyan" />
                       ) : (
                         <span className="text-[10px] font-display text-muted-foreground font-black">SLOT</span>
                       )}
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    onClick={handleReroll}
                    disabled={selectedRerollIds.length < 3 || isRerolling}
                    className="h-20 w-32 border-2 border-cyan/40 bg-cyan-950/20 text-cyan hover:bg-cyan/20 font-display font-black tracking-widest text-xs flex flex-col gap-1 disabled:opacity-20"
                  >
                     <Sparkles className="h-5 w-5" />
                     {isRerolling ? 'FUNDINDO...' : 'REROLL'}
                  </Button>
               </div>
            </div>

            {/* Skins Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mySkins.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-30 text-xs font-display tracking-[0.5em] uppercase">Sua coleção está vazia. Visite a Loja para abrir cápsulas!</div>
              )}
              {mySkins.map((s) => {
                const isSelected = selectedRerollIds.includes(s.skin_id);
                return (
                  <motion.div
                    key={s.skin_id}
                    layout
                    whileHover={{ scale: 1.05 }}
                    onClick={() => toggleRerollSelection(s.skin_id)}
                    className={`panel p-3 cursor-pointer group relative overflow-hidden transition-all ${
                      isSelected ? "border-cyan shadow-glow" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className={`aspect-square rounded-lg mb-3 grid place-items-center relative bg-black/40 border border-white/5`}>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                       <span className="font-display text-4xl font-black text-white/20 z-0">{s.name[0]}</span>
                       
                       <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                         <div>
                          <div className={`text-[8px] font-display font-black tracking-widest uppercase ${
                            s.rarity === 'Divino' ? 'text-cyan' : s.rarity === 'Épico' ? 'text-accent' : 'text-primary'
                          }`}>
                            {s.rarity}
                          </div>
                          <div className="text-[10px] font-display font-bold text-white truncate max-w-[80px]">{s.name}</div>
                         </div>
                         <div className="h-6 w-6 rounded bg-black/60 border border-white/10 flex items-center justify-center text-[10px] font-display font-black">
                           x{s.count}
                         </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] text-muted-foreground uppercase tracking-widest">{s.champion_name}</span>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-400 font-display font-black italic">+{s.damage_bonus}%</span>
                          {!s.is_equipped ? (
                            <button 
                              onClick={(e) => handleEquip(s.skin_id, e)}
                              className="text-[8px] font-display font-black text-cyan hover:text-white uppercase transition-colors"
                            >
                              [ EQUIPAR ]
                            </button>
                          ) : (
                            <span className="text-[8px] font-display font-black text-cyan shadow-glow-sm uppercase">Equipado</span>
                          )}
                       </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-cyan text-black rounded-full p-0.5 shadow-glow">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Layers className="h-3 w-3" />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
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
