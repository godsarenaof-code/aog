import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Coins, Gem, Sparkles, Box, TrendingUp, History } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const CAPSULES = [
  { id: 'basic', name: 'Unidade de Extração (Bronze)', cost: 500, currency: 'gold', color: 'text-orange-400', border: 'border-orange-900/30', bg: 'bg-orange-950/20', icon: Box, desc: 'Design industrial com luzes foscas. Ideal para fragmentos de nível básico.' },
  { id: 'advanced', name: 'Unidade de Extração (Ciano)', cost: 150, currency: 'essence', color: 'text-cyan', border: 'border-cyan/20', bg: 'bg-cyan/5', icon: Sparkles, desc: 'Estrutura cromada com luzes ciano. Maior pureza nos dados extraídos.' },
  { id: 'mythic', name: 'Unidade de Extração (Roxa)', cost: 450, currency: 'essence', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-950/20', icon: Sparkles, desc: 'Unidade flutuante que emana energia escura. Fragmentos Místicos e Épicos.' },
  { id: 'divine', name: 'Unidade de Extração (Dourada)', cost: 900, currency: 'essence', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10', icon: Sparkles, desc: 'Tecnologia das Deidades em ouro e luz branca. Garantia de Firmware Divino.' },
];

const Store = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "capsules");
  const [balance, setBalance] = useState({ gold: 0, essence: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [lastLoot, setLastLoot] = useState<any>(null);

  const fetchBalance = async () => {
    const token = localStorage.getItem('aog_token');
    const res = await fetch('http://localhost:3001/api/store/balance', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setBalance(await res.json());
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const buyCapsule = async (type: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('aog_token');
      const res = await fetch('http://localhost:3001/api/store/buy-capsule', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ type })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setLastLoot(data.skin);
      toast.success(data.message);
      fetchBalance();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addEssence = async (amount: number) => {
    const token = localStorage.getItem('aog_token');
    await fetch('http://localhost:3001/api/store/add-essence', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ amount })
    });
    toast.success(`${amount} Essências adicionadas!`);
    fetchBalance();
  };

  return (
    <AppLayout>
      <div className="container max-w-6xl py-8 space-y-8 animate-fade-in relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-display tracking-[0.4em] text-accent font-black">// DATA EXTRACTION</div>
            <h1 className="font-display text-4xl font-black mt-2 italic uppercase tracking-tighter">UNIDADES DE <span className="text-cyan text-glow">EXTRAÇÃO</span></h1>
            <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Recupere firmwares de deuses antigos e heróis lendários</p>
          </div>

          <div className="flex gap-4 p-4 bg-black/40 border border-white/5 rounded-xl backdrop-blur-xl">
             <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                   <Coins className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                   <div className="text-[9px] font-display text-muted-foreground uppercase">Ouro Total</div>
                   <div className="font-display text-base font-bold">{balance.gold.toLocaleString()}</div>
                </div>
             </div>
             <div className="w-[1px] bg-white/10 h-full mx-2" />
             <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                   <Gem className="h-4 w-4 text-cyan" />
                </div>
                <div>
                   <div className="text-[9px] font-display text-muted-foreground uppercase">Essência</div>
                   <div className="font-display text-base font-bold text-cyan">{balance.essence.toLocaleString()}</div>
                </div>
             </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
           <TabsList className="bg-black/20 border border-white/5 p-1 mb-8">
              <TabsTrigger value="capsules" className="font-display text-[10px] tracking-widest uppercase">Cápsulas de Skin</TabsTrigger>
              <TabsTrigger value="currency" className="font-display text-[10px] tracking-widest uppercase">Banco de Essência</TabsTrigger>
           </TabsList>

           <TabsContent value="capsules" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {CAPSULES.map((cap) => (
                   <motion.div 
                    key={cap.id}
                    whileHover={{ scale: 1.02 }}
                    className={`panel p-6 flex flex-col bg-card/60 ${cap.border} group relative overflow-hidden`}
                   >
                      <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                        <cap.icon className="h-16 w-16" />
                      </div>
                      
                      <div className="relative z-10 flex-1">
                        <div className={`text-[10px] font-display uppercase tracking-widest font-black mb-2 px-2 py-0.5 rounded bg-white/5 inline-block ${cap.color}`}>
                           {cap.name}
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 leading-relaxed line-clamp-2 italic">{cap.desc}</p>
                      </div>

                      <div className="mt-8 space-y-4">
                         <div className="flex items-center gap-2">
                            {cap.currency === 'gold' ? <Coins className="h-4 w-4 text-amber-500" /> : <Gem className="h-4 w-4 text-cyan" />}
                            <span className="font-display text-xl font-black">{cap.cost}</span>
                         </div>
                         <Button 
                          onClick={() => buyCapsule(cap.id)}
                          disabled={isLoading}
                          className={`w-full font-display tracking-widest text-[10px] h-10 ${cap.bg} ${cap.color} hover:${cap.bg} hover:brightness-125 border ${cap.border}`}
                         >
                            {isLoading ? 'SORTEANDO...' : 'ADQUIRIR AGORA'}
                         </Button>
                      </div>
                   </motion.div>
                 ))}
              </div>

              {lastLoot && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="panel-glow p-8 border-cyan/30 bg-cyan-950/10 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in"
                >
                   <div className="text-[10px] font-display tracking-widest text-cyan font-black italic uppercase animate-pulse">!! NOVO ITEM CONQUISTADO !!</div>
                   <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-cyan/20 to-accent/20 border-2 border-cyan/40 shadow-glow grid place-items-center mb-2">
                      <Sparkles className="h-12 w-12 text-cyan" />
                   </div>
                   <h3 className="font-display text-3xl font-black uppercase italic tracking-tighter">{lastLoot.name}</h3>
                   <div className="px-4 py-1 rounded-full bg-white/10 text-[10px] font-display tracking-widest uppercase border border-white/10">
                      Firmware: <span className="text-cyan">{lastLoot.rarity}</span> · 
                      Bonus: <span className="text-emerald-400">+{lastLoot.damage_bonus || 0} ATK</span> / <span className="text-blue-400">+{lastLoot.hp_bonus || 0}% HP</span>
                   </div>
                   <Button variant="ghost" onClick={() => setLastLoot(null)} className="text-[9px] font-display tracking-[0.3em] font-black opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted">
                     FECHAR RECOMPENSA
                   </Button>
                </motion.div>
              )}
           </TabsContent>

           <TabsContent value="currency" className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                 {[
                   { id: 'pack1', name: 'Lote Iniciante', essence: 500, price: 'R$ 9,90', bonus: '+0%' },
                   { id: 'pack2', name: 'Lote Intermediário', essence: 2200, price: 'R$ 39,90', bonus: '+10%' },
                   { id: 'pack3', name: 'Lote Divino', essence: 5000, price: 'R$ 89,90', bonus: '+25%' },
                 ].map(pack => (
                   <div key={pack.id} className="panel p-8 flex flex-col items-center bg-cyan-950/10 border-cyan/20 gap-4 text-center group">
                      <div className="relative">
                        <Gem className="h-16 w-16 text-cyan mb-2 group-hover:scale-110 transition-transform" />
                        <div className="absolute -top-2 -right-4 bg-emerald-500 text-[8px] font-black font-display p-1 px-2 rounded-full border border-emerald-400 shadow-glow-sm">{pack.bonus} BONUS</div>
                      </div>
                      <div className="font-display font-black text-[10px] tracking-widest uppercase opacity-60">{pack.name}</div>
                      <div className="font-display text-4xl font-black text-white italic">{pack.essence.toLocaleString()}</div>
                      <Button 
                        onClick={() => addEssence(pack.essence)}
                        className="w-full mt-4 bg-primary border-none text-black font-black hover:bg-primary-glow font-display tracking-widest text-[10px] h-12 italic shadow-glow-sm"
                      >
                         OBTER POR {pack.price}
                      </Button>
                   </div>
                 ))}
              </div>
           </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Store;
