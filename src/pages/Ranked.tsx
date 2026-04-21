import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getRankFromLp } from "@/lib/rankUtils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, Users, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Ranked = () => {
  const { user } = useAuth();
  const userMmr = user?.mmr || 1000;
  const currentRank = getRankFromLp(userMmr);

  // Fetching Global Leaderboard
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3001/api/user/leaderboard");
      if (!res.ok) throw new Error("Erro ao buscar ranking.");
      return res.json();
    },
  });

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

            {/* Emblem Section */}
            <div className="panel-glow p-1 w-full aspect-square max-w-[450px] mx-auto lg:mx-0 relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-accent/10 rounded-3xl -z-10" />
               <div className="h-full w-full rounded-[20px] bg-black/60 backdrop-blur-3xl flex flex-col items-center justify-center p-8 border border-white/5 relative overflow-hidden">
                  
                  {/* Rotating Background Ring */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full scale-75 opacity-20"
                  />

                  {/* Main Emblem Placeholder (Simulated with Icons) */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`h-48 w-48 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center relative shadow-glow-lg ${currentRank.color.replace('text-', 'shadow-')}`}
                  >
                     <Trophy className={`h-24 w-24 ${currentRank.color} drop-shadow-[0_0_15px_currentColor]`} />
                     
                     {/* Floating Particles */}
                     <span className="absolute top-0 right-0 h-4 w-4 bg-cyan animate-pulse rounded-full blur-sm" />
                     <span className="absolute bottom-4 left-4 h-3 w-3 bg-accent animate-pulse rounded-full blur-sm" />
                  </motion.div>

                  <div className="mt-8 text-center space-y-3 relative z-10">
                     <div className={`font-display text-4xl font-black italic uppercase tracking-tighter ${currentRank.color}`}>
                       {currentRank.full}
                     </div>
                     <div className="flex items-center justify-center gap-4 text-[10px] font-display font-black tracking-widest text-muted-foreground uppercase">
                        {userMmr} MMR <span className="h-1 w-1 rounded-full bg-white/20" /> TOP AREA BR1
                     </div>
                     
                     {/* LP Progress */}
                     <div className="w-64 space-y-2 mt-4 mx-auto">
                        <div className="flex justify-between text-[10px] font-display font-bold uppercase tracking-wider">
                           <span>{lpProgress} LP</span>
                           <span className="opacity-40">100 LP</span>
                        </div>
                        <Progress value={lpProgress} className="h-1.5 bg-white/5" />
                        <p className="text-[9px] text-muted-foreground uppercase italic opacity-40">Vença partidas para ascender ao próximo tier</p>
                     </div>
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
                          <span className={`font-display font-bold uppercase tracking-tight text-sm ${index === 0 ? "text-cyan" : "text-white"}`}>
                            {player.nickname}
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{player.rank}</span>
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
