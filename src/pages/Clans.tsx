import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Users, Search, Plus, Shield, ShieldCheck, UserMinus, LogOut, Trophy, Target, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const Clans = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clanInfo, setClanInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", tag: "", description: "" });

  const fetchClanData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('aog_token');
      const res = await fetch('http://localhost:3001/api/clans/my-clan', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.inClan) {
        setClanInfo(data);
      } else {
        setClanInfo(null);
        fetchGlobalClans("");
      }
    } catch (err) {
      toast.error("Erro ao carregar dados do Sindicato.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalClans = async (q: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/clans/search?q=${q}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchClanData();
  }, []);

  const handleCreateClan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('aog_token');
      const res = await fetch('http://localhost:3001/api/clans/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Sindicato fundado com sucesso!");
        setShowCreateModal(false);
        fetchClanData();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Erro ao fundar sindicato.");
    }
  };

  const handleJoinClan = async (clanId: string) => {
    try {
      const token = localStorage.getItem('aog_token');
      const res = await fetch('http://localhost:3001/api/clans/join', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ clanId })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchClanData();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Erro ao ingressar no sindicato.");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="h-screen flex items-center justify-center font-display tracking-[0.4em] opacity-30 animate-pulse">
          SINCRONIZANDO SINDICATOS...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container max-w-7xl py-8 space-y-12 animate-fade-in relative">
        
        {/* State 1: NO CLAN - Discovery Mode */}
        {!clanInfo ? (
          <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="text-xs font-display tracking-[0.5em] text-primary font-black uppercase">// SOCIAL PROTOCOL</div>
                <h1 className="font-display text-5xl font-black italic uppercase tracking-tighter">
                  BUSCAR <span className="text-primary text-glow">SINDICATOS</span>
                </h1>
                <p className="text-muted-foreground text-xs uppercase tracking-widest opacity-60">Encontre sua facção ou funde um novo império por 1.000 Ouro</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="group flex items-center gap-3 bg-primary text-black font-display font-black tracking-widest px-8 py-4 rounded-xl shadow-glow-sm hover:shadow-glow transition-all uppercase text-xs"
              >
                <Plus className="h-4 w-4" />
                Fundar Sindicato
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="PROCURAR POR NOME OU TAG..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value.toUpperCase());
                  fetchGlobalClans(e.target.value);
                }}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 pl-16 font-display text-sm tracking-widest focus:outline-none focus:border-primary/40 transition-all backdrop-blur-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {searchResults.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-20 font-display tracking-widest text-xs uppercase italic">Nenhum sindicato ativo encontrado com esse registro.</div>
              )}
              {searchResults.map((clan) => (
                <motion.div 
                  key={clan.id}
                  whileHover={{ y: -5 }}
                  className="panel-glow p-8 space-y-6 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                       <div className="h-12 w-12 rounded bg-primary/10 border border-primary/20 grid place-items-center font-display font-black text-primary">
                          {clan.tag}
                       </div>
                       <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-display font-black text-muted-foreground uppercase opacity-40">
                         LVL {clan.level}
                       </div>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">{clan.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-2 font-medium leading-relaxed opacity-60">
                        {clan.description || "Sem descrição pública registrada."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="flex flex-col">
                          <span className="text-[ surveillance opacity-30 uppercase font-black text-[9px] tracking-widest">MEMBROS</span>
                          <span className="font-display font-black text-sm">{clan.member_count}/{clan.max_members}</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => handleJoinClan(clan.id)}
                      className="bg-white/10 hover:bg-primary hover:text-black py-2 px-4 rounded font-display font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      SOLICITAR ACESSO
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* State 2: MEMBER - Clan Dashboard */
          <div className="space-y-12">
             <div className="flex flex-col lg:flex-row gap-12">
                
                {/* LEFT: Clan Stats & Profile */}
                <div className="lg:w-1/3 space-y-6">
                   <div className="panel-glow p-10 space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
                         <ShieldCheck className="h-40 w-40" />
                      </div>

                      <div className="space-y-2">
                        <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/40 grid place-items-center font-display font-black text-3xl text-primary shadow-glow-sm">
                           {clanInfo.clan.tag}
                        </div>
                        <h1 className="text-4xl font-display font-black italic uppercase tracking-tighter mt-6">{clanInfo.clan.name}</h1>
                        <p className="text-xs font-display font-black tracking-widest text-primary uppercase opacity-60 italic">"{clanInfo.clan.motto || 'Pela Gloria de AOG'}"</p>
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between items-end text-[10px] font-display font-black tracking-widest uppercase mb-1">
                            <span>Sincronia do Sindicato (LVL {clanInfo.clan.level})</span>
                            <span className="text-primary">{clanInfo.clan.xp}/5000 XP</span>
                         </div>
                         <Progress value={(clanInfo.clan.xp / 5000) * 100} className="h-1.5 bg-white/5" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                         <div className="space-y-1">
                            <div className="text-[ surveillance opacity-30 text-[9px] font-black uppercase">Membros</div>
                            <div className="font-display font-black text-lg">{clanInfo.members.length} / {clanInfo.clan.max_members}</div>
                         </div>
                         <div className="space-y-1 text-right">
                            <div className="text-[ surveillance opacity-30 text-[9px] font-black uppercase">Fundação</div>
                            <div className="font-display font-black text-lg text-primary">{new Date(clanInfo.clan.created_at).toLocaleDateString()}</div>
                         </div>
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-white/5 border border-white/5 hover:border-red-500/40 hover:text-red-500 transition-all font-display font-black text-[10px] tracking-widest uppercase">
                         <LogOut className="h-4 w-4" />
                         Abandonar Sindicato
                      </button>
                   </div>

                   <div className="panel p-6 bg-primary/5 border-primary/20 space-y-4">
                      <div className="flex items-center gap-3 text-primary">
                         <Target className="h-5 w-5" />
                         <span className="text-[10px] font-display font-black tracking-widest uppercase">Objetivo Semanal</span>
                      </div>
                      <p className="text-xs text-muted-foreground uppercase font-bold leading-relaxed tracking-tight opacity-60">
                        Vencer 50 partidas ranqueadas coletivamente para desbloquear o Bônus de Essência do Sindicato.
                      </p>
                      <Progress value={45} className="h-1 bg-white/10" />
                   </div>
                </div>

                {/* RIGHT: Member List */}
                <div className="flex-1 space-y-6">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                         <Users className="h-5 w-5 text-primary" />
                         <h2 className="font-display text-lg font-black uppercase tracking-widest">Protocolo de Membros</h2>
                      </div>
                      <div className="text-[ surveillance opacity-20 text-[9px] font-black tracking-widest">QUADRO DISCIPLINAR</div>
                   </div>

                   <div className="space-y-2">
                      {clanInfo.members.map((member: any) => (
                        <div key={member.nickname} className="panel p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                           <div className="flex items-center gap-6">
                              <div className={`h-10 w-10 rounded border grid place-items-center ${
                                member.role === 'LIDER' ? 'border-primary text-primary bg-primary/10' :
                                member.role === 'OFICIAL' ? 'border-cyan text-cyan bg-cyan/10' :
                                'border-white/10 text-white/40'
                              }`}>
                                 {member.role === 'LIDER' ? <ShieldCheck className="h-5 w-5" /> : member.role === 'OFICIAL' ? <Shield className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                              </div>
                              <div>
                                 <div className="flex items-center gap-2">
                                    <span className="font-display font-black uppercase text-sm tracking-tight">{member.nickname}</span>
                                    {member.role !== 'MEMBRO' && (
                                       <span className={`text-[8px] px-1.5 py-0.5 rounded font-display font-black uppercase tracking-widest ${
                                         member.role === 'LIDER' ? 'bg-primary text-black' : 'bg-cyan text-black'
                                       }`}>
                                          {member.role}
                                       </span>
                                    )}
                                 </div>
                                 <div className="text-[ surveillance opacity-30 text-[9px] uppercase font-black">{member.rank} // {member.mmr} MMR</div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-8">
                             <div className="hidden md:flex flex-col items-end">
                                <span className="text-[9px] font-display font-black text-white/20 uppercase tracking-widest">ATIVIDADE</span>
                                <span className="font-display text-[10px] font-bold text-emerald-400">ONLINE</span>
                             </div>
                             {clanInfo.clan.leader_id === user?.id && member.role !== 'LIDER' && (
                                <button className="h-8 w-8 rounded hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                                   <UserMinus className="h-4 w-4" />
                                </button>
                             )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* CREATE CLAN MODAL */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowCreateModal(false)}
                 className="absolute inset-0 bg-black/80 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="relative w-full max-w-lg panel-glow p-8 space-y-8 bg-black/90"
               >
                  <div className="space-y-1">
                    <h2 className="text-3xl font-display font-black italic uppercase tracking-tighter">FUNDAR <span className="text-primary italic">SINDICATO</span></h2>
                    <p className="text-xs text-muted-foreground uppercase font-black opacity-60">REGISTRO OFICIAL NO PROTOCOLO</p>
                  </div>

                  <form onSubmit={handleCreateClan} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                           <label className="text-[10px] font-display font-black text-muted-foreground uppercase tracking-widest opacity-40">Nome do Sindicato</label>
                           <input 
                              required
                              type="text" 
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 font-display text-sm focus:border-primary transition-all tracking-widest"
                              placeholder="EX: NEO OLYMPUS"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-display font-black text-muted-foreground uppercase tracking-widest opacity-40">TAG</label>
                           <input 
                              required
                              type="text" 
                              maxLength={4}
                              value={formData.tag}
                              onChange={(e) => setFormData({...formData, tag: e.target.value.toUpperCase()})}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 font-display text-sm focus:border-primary transition-all tracking-widest text-center"
                              placeholder="ZEUS"
                           />
                        </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-display font-black text-muted-foreground uppercase tracking-widest opacity-40">Descrição de Recrutamento</label>
                         <textarea 
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-4 font-body text-sm focus:border-primary transition-all"
                            placeholder="DESCREVA SEUS OBJETIVOS DIVINOS..."
                         />
                      </div>
                    </div>

                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between font-display font-black italic">
                       <span className="text-xs tracking-widest uppercase">TAXA DE FUNDAÇÃO</span>
                       <span className="text-xl text-primary">1.000 OURO</span>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 py-4 font-display font-black text-[10px] tracking-widest uppercase border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                      >
                        CANCELAR
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-4 bg-primary text-black font-display font-black text-[10px] tracking-widest uppercase rounded-lg shadow-glow-sm hover:shadow-glow transition-all"
                      >
                        AUTORIZAR REGISTRO
                      </button>
                    </div>
                  </form>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
};

export default Clans;
