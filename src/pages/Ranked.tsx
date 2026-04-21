import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getRankFromLp, RANK_CONFIG } from "@/lib/rankUtils";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, Users, ChevronRight, Hexagon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

const Ranked = () => {
  const { user } = useAuth();
  const userMmr = user?.mmr || 0;
  const userRankInfo = getRankFromLp(userMmr);
  
  const [selectedRank, setSelectedRank] = useState(userRankInfo.name);

  // Fetching Rank-Specific Leaderboard
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ["leaderboard", selectedRank],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/api/user/leaderboard?rank=${selectedRank}&userId=${user?.id}`);
      if (!res.ok) throw new Error("Erro ao buscar ranking.");
      return res.json();
    },
  });

  const leaderboard = leaderboardData?.leaderboard || [];
  const globalPosition = leaderboardData?.userPosition;

  // Encontrar a config visual do rank selecionado para o emblema central
  const displayRankConfig = RANK_CONFIG.find(r => r.name === selectedRank) || RANK_CONFIG[0];

  // Calculate LP progress (0-100 placeholder relative to tier)
  const lpProgress = 65; // Example LP

  return (
    <AppLayout>
      <div className="container max-w-7xl py-8 space-y-12 animate-fade-in relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-cyan/5 blur-[100px] rounded-full" />

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LEFT COLUMN: Player Status & Rank Emblem */}
          <div className="lg:w-1/2 w-full space-y-8 sticky top-8">
            <div className="space-y-2">
              <div className="text-xs font-display tracking-[0.5em] text-accent font-black uppercase">// COMPETITIVE STATUS</div>
              <h1 className="font-display text-5xl font-black italic uppercase tracking-tighter">
                JORNADA <span className="text-cyan text-glow">RANQUEADA</span>
              </h1>
              <p className="text-muted-foreground text-xs uppercase tracking-widest opacity-60">Sua ascensão no protocolo de deidades</p>
            </div>

            {/* Selection Hub: Vertical List + Emblem */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-black/40 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
               
               {/* Vertical Rank List */}
               <div className="w-full md:w-48 space-y-2">
                  <div className="text-[10px] font-display font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 opacity-40">Categorias de Elo</div>
                  <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                     {RANK_CONFIG.map((rank) => (
                       <button
                        key={rank.name}
                        onClick={() => setSelectedRank(rank.name)}
                        className={`w-full group relative flex items-center gap-3 p-3 rounded-xl transition-all border border-transparent
                          ${selectedRank === rank.name 
                            ? "bg-white/10 text-white border-white/10 shadow-glow-sm" 
                            : "text-white/30 hover:bg-white/5 hover:text-white/60"}
                        `}
                       >
                          {selectedRank === rank.name && (
                            <motion.div layoutId="activeRank" className="absolute left-0 w-1 h-6 bg-cyan rounded-full" />
                          )}
                          <img 
                            src={rank.imageUrl} 
                            alt={rank.name}
                            className="w-8 h-8 group-hover:scale-110 transition-transform object-contain"
                            onerror="this.style.display='none'"
                          />
                          <span className="text-[10px] font-display font-black tracking-widest uppercase text-left">{rank.name}</span>
                       </button>
                     ))}
                  </div>
               </div>

               {/* Right Side: Large Animated Emblem */}
               <div className="flex-1 w-full flex flex-col items-center justify-center space-y-6">
                  <div className="panel-glow p-1 w-full aspect-square max-w-[320px] relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-accent/10 rounded-3xl -z-10" />
                    <div className="h-full w-full rounded-[20px] bg-black/60 backdrop-blur-3xl flex flex-col items-center justify-center p-8 border border-white/5 relative overflow-hidden">
                        
                        {/* Rotating Background Ring */}
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full scale-75 opacity-20"
                        />

                        {/* Main Emblem Image Area */}
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={selectedRank}
                            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                            transition={{ duration: 0.4 }}
                            className={`h-48 w-48 relative flex items-center justify-center`}
                          >
                             <img 
                                src={displayRankConfig.imageUrl} 
                                alt={selectedRank}
                                className={`w-full h-full object-contain drop-shadow-[0_0_30px_currentColor] ${displayRankConfig.color.replace('text-', 'text-shadow-')}`}
                             />
                             
                             {/* Aura Effect */}
                             <div className={`absolute inset-0 blur-3xl opacity-20 -z-10 rounded-full ${displayRankConfig.color.replace('text-', 'bg-')}`} />
                          </motion.div>
                        </AnimatePresence>
                    </div>
                  </div>

                  <div className="text-center space-y-2 relative">
                     <div className={`font-display text-4xl font-black italic uppercase tracking-tighter ${displayRankConfig.color} animate-fade-in flex items-center justify-center gap-3`}>
                       {selectedRank}
                       {selectedRank === userRankInfo.name && userRankInfo.tier && (
                         <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10 text-xl not-italic shadow-glow-sm">
                           {userRankInfo.tier}
                         </span>
                       )}
                     </div>
                     <div className="flex items-center justify-center gap-4 text-[10px] font-display font-black tracking-widest text-muted-foreground uppercase opacity-40">
                        PROTOCOLO ACTIVE <span className="h-1 w-1 rounded-full bg-white/20" /> CATEGORIA {selectedRank}
                     </div>
                     
                     {/* LP Progress (Only if current rank) */}
                     {selectedRank === userRankInfo.name && (
                       <div className="w-64 space-y-2 mt-4 mx-auto animate-fade-in">
                          <div className="flex justify-between text-[10px] font-display font-bold uppercase tracking-wider">
                             <span>STATUS ATUAL</span>
                             <span className="text-cyan">{userRankInfo.full}</span>
                          </div>
                          <Progress value={lpProgress} className="h-1.5 bg-white/5" />
                       </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
               <div className="panel p-4 flex items-center gap-4 border-white/5 bg-white/5">
                  <div className="h-10 w-10 rounded-lg bg-cyan/10 flex items-center justify-center text-cyan">
                     <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-black">Taxa de Vit.</div>
                    <div className="font-display font-bold text-lg">54.2%</div>
                  </div>
               </div>
               <div className="panel p-4 flex items-center gap-4 border-white/5 bg-white/5">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                     <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-black">Mundo</div>
                    <div className="font-display font-bold text-lg">Top 12%</div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Global Leaderboard */}
          <div className="lg:w-1/2 w-full space-y-6">
            <div className="flex items-end justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display text-lg font-black uppercase tracking-widest">Ranking Global</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Os Melhores Invocadores do Protocolo</p>
              </div>
              <div className="text-[ surveillance font-display opacity-20 text-xs font-black tracking-widest">00:42:11 / UPDATE</div>
            </div>

            <div className="space-y-3">
              {isLoadingLeaderboard ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-16 w-full panel bg-white/5 border-white/5 animate-pulse" />
                ))
              ) : (
                leaderboard?.map((player: any, index: number) => (
                  <motion.div 
                    key={player.nickname}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`panel p-4 flex items-center justify-between group hover:border-cyan/40 transition-all ${
                      index === 0 ? "bg-cyan/5 border-cyan/20" : "bg-white/5 border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`h-8 w-8 rounded font-display font-black flex items-center justify-center text-sm ${
                         index === 0 ? "bg-amber-400 text-black shadow-glow-sm" : 
                         index === 1 ? "bg-slate-300 text-black" :
                         index === 2 ? "bg-orange-400 text-black" :
                         "bg-white/5 text-white/40"
                       }`}>
                          {index + 1}
                       </div>
                       <div className="flex flex-col">
                          <span className={`font-display font-bold uppercase tracking-tight text-sm ${
                            player.nickname === user?.nickname ? "text-cyan" : "text-white"
                          }`}>
                            {player.nickname} {player.nickname === user?.nickname && "(VOCÊ)"}
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">
                            {player.rank}
                          </span>
                       </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className="flex flex-col items-end">
                          <div className="text-[10px] font-display font-black text-white/40 uppercase">MMR</div>
                          <div className={`font-display font-black ${index === 0 ? "text-cyan" : ""}`}>{player.mmr.toLocaleString()}</div>
                       </div>
                       <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-cyan group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* PINNED: User Position Footer */}
            {globalPosition && (
               <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="text-[10px] font-display font-black tracking-widest text-muted-foreground mb-4 uppercase opacity-40">Seu Lugar na Arena</div>
                  <div className="panel p-5 bg-primary/5 border-primary/20 flex items-center justify-between shadow-glow-sm">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-display font-black text-primary">
                           {globalPosition}º
                        </div>
                        <div className="flex flex-col">
                           <span className="font-display font-bold uppercase text-white">{user?.nickname}</span>
                           <span className="text-[9px] text-primary uppercase font-black tracking-widest">{userRankInfo.full}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] font-display font-black text-white/40 uppercase"> MMR ATUAL</div>
                        <div className="font-display font-black text-primary text-xl">{userMmr}</div>
                     </div>
                  </div>
               </div>
            )}

            <div className="pt-8 flex justify-center">
               <button className="text-[10px] font-display font-black tracking-widest text-muted-foreground hover:text-cyan border-b border-white/10 pb-1 uppercase transition-colors">
                  Carregar Mais Participantes
               </button>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default Ranked;
