import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { User, Settings as SettingsIcon, Palette, Volume2, ShieldCheck, Save, Clock, Diamond } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");
  const [newNickname, setNewNickname] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [essence, setEssence] = useState(0);
  const [titles, setTitles] = useState<any[]>([]);
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

  const avatarPresets = [
    "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Zeus&backgroundColor=00cfba",
    "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Hera&backgroundColor=8b5cf6",
    "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Ares&backgroundColor=ef4444",
    "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Athena&backgroundColor=3b82f6",
    "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=AOG&backgroundColor=f97316"
  ];

  // Simulation of visual settings
  const [visualSettings, setVisualSettings] = useState({
    bloom: true,
    scanlines: false,
    performanceMode: false
  });

  const [audioSettings, setAudioSettings] = useState({
    master: 80,
    music: 60,
    sfx: 90
  });

  useEffect(() => {
    // Fetch essence for cost display
    const fetchEssence = async () => {
      const token = localStorage.getItem('aog_token');
      if (!token) return;
      const res = await fetch('http://localhost:3001/api/user/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEssence(data.essence || 0);
        setSelectedTitleId(data.selectedTitleId || null);
      }
    };

    const fetchTitles = async () => {
      const token = localStorage.getItem('aog_token');
      const res = await fetch('http://localhost:3001/api/user/titles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTitles(await res.json());
    };

    fetchEssence();
    fetchTitles();
  }, []);

  const handleUpdateNickname = async () => {
    if (!newNickname || newNickname.length < 3) {
      toast.error("Nickname muito curto.");
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('aog_token');
      const res = await fetch('http://localhost:3001/api/user/update-nickname', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ newNickname })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setNewNickname("");
        // In a real app we'd reload the user context here
        window.location.reload(); 
      } else {
        toast.error(data.error || "Erro ao atualizar nickname.");
      }
    } catch (err) {
      toast.error("Erro de conexão com o terminal.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectTitle = async (titleId: string | null) => {
    try {
      const token = localStorage.getItem('aog_token');
      const res = await fetch('http://localhost:3001/api/user/select-title', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ titleId })
      });
      if (res.ok) {
        toast.success("Título atualizado!");
        setSelectedTitleId(titleId);
        window.location.reload();
      }
    } catch (err) {}
  };

  const handleUpdateAvatar = async (url: string | null) => {
    try {
      const token = localStorage.getItem('aog_token');
      const res = await fetch('http://localhost:3001/api/user/update-avatar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ avatarUrl: url })
      });
      if (res.ok) {
        toast.success("Avatar atualizado!");
        setAvatarUrl(url || "");
        window.location.reload();
      }
    } catch (err) {
      toast.error("Erro ao atualizar avatar.");
    }
  };

  const tabs = [
    { id: "perfil", label: "Identidade", icon: User },
    { id: "visual", label: "Protocolo Visual", icon: Palette },
    { id: "audio", label: "Frequência de Áudio", icon: Volume2 },
    { id: "seguranca", label: "Segurança", icon: ShieldCheck },
  ];

  return (
    <AppLayout>
      <div className="container max-w-5xl py-8 space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 space-y-2">
             <div className="text-[10px] font-display font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 opacity-40 px-3">Configurações do Kernel</div>
             {tabs.map((tab) => (
               <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full group relative flex items-center gap-3 p-4 rounded-xl transition-all border border-transparent
                  ${activeTab === tab.id 
                    ? "bg-white/10 text-white border-white/10 shadow-glow-sm" 
                    : "text-white/30 hover:bg-white/5 hover:text-white/60"}
                `}
               >
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-6 bg-primary rounded-full" />
                  )}
                  <tab.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? "text-primary" : ""}`} />
                  <span className="text-[10px] font-display font-black tracking-widest uppercase">{tab.label}</span>
               </button>
             ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-h-[500px] panel-glow p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <SettingsIcon className="h-64 w-64 rotate-12" />
             </div>

             <AnimatePresence mode="wait">
                {activeTab === "perfil" && (
                  <motion.div
                    key="perfil"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-1">
                        <h2 className="text-2xl font-display font-black italic uppercase italic tracking-tighter">PROTOCOLO DE <span className="text-primary italic">IDENTIDADE</span></h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest opacity-60">Gerencie sua assinatura e presença visual na Arena</p>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                       <div className="space-y-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-display font-black tracking-widest text-muted-foreground uppercase">Nickname Atual</label>
                          <div className="panel bg-white/5 border-white/10 p-4 font-display font-bold text-white tracking-widest bg-stripes">
                             {user?.nickname || "INVOCADOR"}
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-display font-black tracking-widest text-muted-foreground uppercase">Novo Nickname</label>
                          <div className="relative">
                             <input 
                                type="text" 
                                value={newNickname}
                                onChange={(e) => setNewNickname(e.target.value.toUpperCase())}
                                placeholder="DIGITE SEU NOVO NOME..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-4 font-display text-sm focus:outline-none focus:border-primary transition-colors tracking-widest"
                                maxLength={16}
                             />
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-display text-muted-foreground opacity-30 mt-1">
                                {newNickname.length}/16
                             </div>
                          </div>
                       </div>

                       <div className="panel p-4 bg-primary/5 border-primary/20 space-y-3">
                          <div className="flex items-center gap-3 text-primary">
                             <Clock className="h-4 w-4" />
                             <span className="text-[10px] font-display font-black tracking-widest uppercase">Diretriz Temporal</span>
                          </div>
                          <p className="text-[10px] leading-relaxed text-muted-foreground uppercase font-bold tracking-tight">
                             Limite de uma alteração a cada <span className="text-white">30 dias</span>.
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                             <div className="flex items-center gap-2">
                                <Diamond className="h-3 w-3 text-cyan" />
                                <span className="text-[9px] font-display font-black text-white/40 uppercase">Custo de Processamento</span>
                             </div>
                             <span className="text-[10px] font-display font-black text-cyan uppercase underline">
                                40 ESSÊNCIAS (1ª GRÁTIS)
                             </span>
                          </div>
                       </div>

                       <button 
                         onClick={handleUpdateNickname}
                         disabled={isUpdating || !newNickname}
                         className={`w-full group py-4 rounded-lg font-display font-black tracking-[0.3em] uppercase text-xs transition-all
                           ${isUpdating || !newNickname 
                             ? "bg-white/5 text-white/20 cursor-not-allowed" 
                             : "bg-primary text-black hover:bg-primary/80 shadow-glow-sm hover:shadow-glow"}
                         `}
                       >
                          {isUpdating ? "SINCRONIZANDO..." : "AUTORIZAR ALTERAÇÃO"}
                       </button>

                       {/* Title Selection */}
                       <div className="space-y-4 pt-6 border-t border-white/5">
                          <label className="text-[10px] font-display font-black tracking-widest text-muted-foreground uppercase opacity-40">Título de Honra</label>
                          <div className="grid grid-cols-1 gap-2">
                             <button 
                                onClick={() => handleSelectTitle(null)}
                                className={`text-left p-3 rounded-lg border font-display font-black text-[10px] uppercase tracking-widest transition-all ${!selectedTitleId ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
                             >
                                [ NENHUM TÍTULO ]
                             </button>
                             {titles.map((title) => (
                               <button 
                                 key={title.id}
                                 disabled={!title.unlocked}
                                 onClick={() => handleSelectTitle(title.id)}
                                 className={`relative text-left p-3 rounded-lg border font-display font-black text-[10px] uppercase tracking-widest transition-all ${
                                   selectedTitleId === title.id 
                                     ? 'bg-white/10 border-white/20' 
                                     : title.unlocked ? 'bg-white/5 border-transparent hover:bg-white/10' : 'bg-black/40 border-transparent opacity-30 cursor-not-allowed'
                                 }`}
                                 style={{ color: title.unlocked ? title.color : 'inherit' }}
                               >
                                  {title.name}
                                  {!title.unlocked && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold opacity-40">BLOQUEADO</span>}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-4">
                          <label className="text-[10px] font-display font-black tracking-widest text-muted-foreground uppercase opacity-40">Protocolo de Avatar (Foto de Perfil)</label>
                          
                          <div className="flex flex-wrap gap-4">
                             {/* Preview box */}
                             <div className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-glow-sm">
                                {avatarUrl ? (
                                  <img src={avatarUrl} className="h-full w-full object-cover" alt="Preview" />
                                ) : (
                                  <div className="h-full w-full grid place-items-center font-display font-black text-white/10 uppercase text-[9px] text-center p-2">NENHUM AVATAR</div>
                                )}
                             </div>
                             
                             <div className="flex-1 space-y-3">
                                <div className="grid grid-cols-5 gap-2">
                                   {avatarPresets.map((preset, idx) => (
                                     <button 
                                        key={idx}
                                        onClick={() => handleUpdateAvatar(preset)}
                                        className="h-10 w-10 rounded border border-transparent hover:border-primary transition-all overflow-hidden"
                                     >
                                        <img src={preset} className="h-full w-full object-cover" />
                                     </button>
                                   ))}
                                </div>
                                <div className="flex gap-2">
                                   <input 
                                      type="text" 
                                      value={avatarUrl}
                                      onChange={(e) => setAvatarUrl(e.target.value)}
                                      placeholder="LINK DA IMAGEM..."
                                      className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 font-display text-[10px] focus:border-primary transition-all tracking-widest"
                                   />
                                   <button 
                                      onClick={() => handleUpdateAvatar(avatarUrl)}
                                      className="px-4 bg-primary/20 text-primary border border-primary/20 rounded-lg font-display font-black text-[10px] tracking-widest uppercase hover:bg-primary hover:text-black transition-all"
                                   >
                                      SET
                                   </button>
                                </div>
                                <button 
                                   onClick={() => handleUpdateAvatar(null)}
                                   className="text-[9px] font-display font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2"
                                >
                                   // REMOVER PROTOCOLO DE IMAGEM
                                </button>
                             </div>
                          </div>
                          
                          <p className="text-[9px] text-muted-foreground uppercase italic opacity-40 leading-relaxed">
                            O avatar será visível em seu perfil, na barra lateral e em convites de Sindicatos. Use URLs de imagens confiáveis.
                          </p>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === "visual" && (
                  <motion.div
                    key="visual"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-1">
                       <h2 className="text-2xl font-display font-black italic uppercase tracking-tighter">RENDERIZAÇÃO DE <span className="text-cyan italic">ELEMENTOS</span></h2>
                       <p className="text-xs text-muted-foreground uppercase tracking-widest opacity-60">Ajuste o brilho das deidades</p>
                    </div>

                    <div className="grid gap-4 max-w-lg">
                       {[
                         { id: "bloom", label: "Pós-processamento Bloom (Neon Glow)", desc: "Aumenta a aura e brilho dos elementos divinos.", active: visualSettings.bloom },
                         { id: "scanlines", label: "Filtro de Scanlines CRT", desc: "Adiciona linhas de interferência retrô-futurista.", active: visualSettings.scanlines },
                         { id: "performanceMode", label: "Modo de Alta Performance", desc: "Desativa partículas complexas para maior FPS.", active: visualSettings.performanceMode },
                       ].map((setting) => (
                         <div key={setting.id} className="panel p-6 flex items-center justify-between bg-white/5 border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="space-y-1">
                               <div className="text-[11px] font-display font-black tracking-widest text-white uppercase">{setting.label}</div>
                               <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight opacity-40">{setting.desc}</div>
                            </div>
                            <div 
                              className={`h-6 w-12 p-1 rounded-full transition-all duration-300 relative cursor-pointer ${setting.active ? "bg-primary/20" : "bg-white/10"}`}
                              onClick={() => setVisualSettings(prev => ({ ...prev, [setting.id]: !prev[setting.id as keyof typeof visualSettings] }))}
                            >
                               <div className={`h-4 w-4 rounded-full transition-all duration-300 ${setting.active ? "bg-primary translate-x-6 shadow-[0_0_15px_hsl(var(--primary))]" : "bg-white/20 translate-x-0"}`} />
                            </div>
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "audio" && (
                   <motion.div
                    key="audio"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-1">
                       <h2 className="text-2xl font-display font-black italic uppercase tracking-tighter">MODULAÇÃO <span className="text-accent italic">SONORA</span></h2>
                       <p className="text-xs text-muted-foreground uppercase tracking-widest opacity-60">Volume dos canais de rádio divinos</p>
                    </div>

                    <div className="grid gap-6 max-w-lg">
                       {[
                         { id: "master", label: "Volume Mestre", value: audioSettings.master },
                         { id: "music", label: "Imersão Musical", value: audioSettings.music },
                         { id: "sfx", label: "Efeitos de Combate", value: audioSettings.sfx },
                       ].map((audio) => (
                         <div key={audio.id} className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-display font-black tracking-widest uppercase">
                               <span className="text-muted-foreground">{audio.label}</span>
                               <span className="text-accent">{audio.value}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative group">
                               <div 
                                 className="h-full bg-accent relative group-hover:shadow-[0_0_15px_#f97316]" 
                                 style={{ width: `${audio.value}%` }} 
                               />
                               <input 
                                 type="range" 
                                 className="absolute inset-0 opacity-0 cursor-pointer"
                                 min="0"
                                 max="100"
                                 value={audio.value}
                                 onChange={(e) => setAudioSettings(prev => ({ ...prev, [audio.id]: parseInt(e.target.value) }))}
                               />
                            </div>
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>

          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
