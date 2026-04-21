import { Trophy, TrendingUp, Crown, Swords } from "lucide-react";
import { getRankFromLp } from "@/lib/rankUtils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const Profile = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);

  const fetchData = async () => {
    const token = localStorage.getItem('aog_token');
    if (!token) return;

    // Buscar Stats
    const statsRes = await fetch('http://localhost:3001/api/user/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (statsRes.ok) setStatsData(await statsRes.json());

    // Buscar Histórico
    const matchesRes = await fetch('http://localhost:3001/api/user/matches', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (matchesRes.ok) setMatches(await matchesRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const userMmr = user?.mmr || 1000;
  const rank = getRankFromLp(userMmr);

  return (
    <AppLayout>
      <div className="container max-w-6xl py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="panel-glow p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="h-28 w-28 rounded-2xl bg-black/40 border-2 border-primary/60 shadow-glow grid place-items-center relative group overflow-hidden">
            <img 
              src={rank.imageUrl} 
              alt={rank.name} 
              className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(0,255,242,0.5)] group-hover:scale-110 transition-transform"
            />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-[10px] font-display tracking-widest text-accent uppercase mb-1 font-black underline decoration-dotted">ELITE DATA PROTOCOL</div>
            
            {/* Active Title */}
            {statsData?.activeTitle && (
              <div 
                className="text-[10px] font-display font-black uppercase tracking-[0.3em] mb-1"
                style={{ color: statsData.titleColor }}
              >
                {statsData.activeTitle}
              </div>
            )}

            <div className="flex items-center justify-center md:justify-start gap-3">
              {statsData?.clanTag && (
                <span className="text-xl font-display font-black text-primary transition-all">
                  [{statsData.clanTag}]
                </span>
              )}
              <h1 className="text-4xl font-display font-black italic uppercase tracking-tighter">{user?.nickname || 'INVOCADOR'}</h1>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
              <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded bg-white/10 border border-white/10 uppercase tracking-widest text-cyan">
                {statsData?.rank || 'Mortal'}
              </span>
              <span className="text-[10px] font-display text-muted-foreground uppercase tracking-[0.2em]">{statsData?.mmr || 1000} MMR</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-display tracking-widest text-muted-foreground uppercase opacity-60">Ranking Global</div>
            <div className="font-display text-3xl text-cyan font-black italic">
              #{statsData?.globalPosition || '--'}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Top 4", value: statsData ? `${statsData.top4Rate}%` : '-', icon: Trophy, color: "accent" },
            { label: "Vitórias", value: statsData ? statsData.wins : '-', icon: Trophy, color: "primary" },
            { label: "Win Rate", value: statsData ? `${statsData.winRate}%` : '-', icon: Swords, color: "primary" },
            { label: "Partidas", value: statsData ? statsData.totalMatches : '-', icon: TrendingUp, color: "accent" },
          ].map((s) => (
            <div key={s.label} className="panel p-6 flex items-center gap-4 group hover:border-primary/40 transition-all">
              <div className={`h-12 w-12 rounded-lg grid place-items-center ${s.color === "accent" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"} group-hover:animate-pulse-glow`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-display font-medium">{s.label}</div>
                <div className="text-2xl font-display font-black mt-0.5">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Match history */}
        <div>
          <h2 className="font-display text-sm tracking-[0.4em] text-muted-foreground mb-6 uppercase">// Histórico Recente</h2>
          <div className="grid gap-3">
            {matches.length === 0 && (
              <div className="py-12 text-center opacity-30 text-[10px] font-display tracking-[0.4em] uppercase">Nenhuma partida registrada na Arena ainda.</div>
            )}
            {matches.map((m) => (
              <div key={m.id} className="panel p-4 flex items-center justify-between hover:border-white/10 transition-colors group">
                <div className="flex items-center gap-6">
                  <div className={`h-10 w-10 rounded text-black font-display font-black grid place-items-center shadow-glow-sm ${
                    m.placement === 1 ? 'bg-amber-400' : m.placement <= 4 ? 'bg-cyan' : 'bg-white/20'
                  }`}>
                    #{m.placement}
                  </div>
                  <div>
                    <div className="text-xs font-display font-black tracking-widest uppercase">
                      {m.placement <= 4 ? 'Vitória' : 'Derrota'} · <span className={m.lp_change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {m.lp_change >= 0 ? '+' : ''}{m.lp_change} LP
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase mt-1">HÁ {new Date(m.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {m.champions?.map((champ: string) => (
                    <div key={champ} className="h-8 w-8 rounded bg-white/5 border border-white/5 flex items-center justify-center text-[8px] font-display font-black uppercase opacity-40 hover:opacity-100 transition-opacity">
                      {champ[0]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
