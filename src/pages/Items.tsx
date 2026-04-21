import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Zap, Plus, ChevronLeft, Sparkles, Box, Info, Skull, Crown, Star, History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForgeSimulator } from "@/components/items/ForgeSimulator";
import { Badge } from "@/components/ui/badge";

export default function Items() {
  const { data: items, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('items').select('*');
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const baseItems = items?.filter(i => i.type === 'base') || [];
  const combinedItems = items?.filter(i => i.type === 'combined') || [];
  const rareItems = items?.filter(i => i.type === 'rare') || [];
  const divineItems = items?.filter(i => i.type === 'divine') || [];
  const specialItems = items?.filter(i => i.type === 'special') || [];
  return (
    <div className="min-h-screen pb-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-background">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container relative z-10 space-y-4 animate-fade-in text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs font-display tracking-[0.3em] text-primary mx-auto md:mx-0">
            <Box className="h-3 w-3" />
            ENCICLOPÉDIA DE HARDWARE
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05]">
            <span className="text-cyan text-glow uppercase">Arsenal dos</span><br/>
            <span className="text-white uppercase transition-all duration-700 hover:text-gold hover:drop-shadow-[0_0_20px_rgba(255,184,0,0.5)] cursor-default">Ciborgues & Deuses</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mx-auto md:mx-0">
            De componentes básicos a relíquias divinas. Domine a forja rúnica e transforme seus campeões em armas imparáveis.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            <Link to="/">
              <Button size="lg" variant="outline" className="border-primary/60 text-primary hover:bg-primary/10 font-display tracking-widest px-8">
                <ChevronLeft className="mr-2 h-4 w-4" /> VOLTAR PARA HOME
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SIMULADOR DE FORJA */}
      <section className="container pb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <ForgeSimulator />
      </section>

      {/* COMPONENTES BASE */}
      <section className="container py-12 space-y-10">
        <div className="flex items-center gap-4">
           <div className="h-px flex-1 bg-border/40" />
           <div className="text-xs font-display tracking-[0.4em] text-accent shrink-0 uppercase">// 01 · MATERIAIS PRIMÁRIOS</div>
           <div className="h-px flex-1 bg-border/40" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {baseItems.map((item) => (
            <div key={item.id} className="panel p-6 flex flex-col items-center text-center gap-3 hover:border-primary/60 transition-all hover:shadow-glow group cursor-default bg-card/30">
              <div className="text-4xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{item.icon}</div>
              <div>
                <h3 className="font-display text-sm mb-1 uppercase tracking-tighter text-foreground group-hover:text-primary">{item.name}</h3>
                <p className="text-[10px] text-muted-foreground font-display opacity-80">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RELÍQUIAS DO SUBMUNDO (RAROS) */}
      <section className="container py-12 space-y-10">
        <div className="flex items-center gap-4">
           <div className="h-px flex-1 bg-border/40" />
           <div className="text-xs font-display tracking-[0.4em] text-[#ff4d4d] shrink-0 uppercase">// 02 · RELÍQUIAS DO SUBMUNDO</div>
           <div className="h-px flex-1 bg-border/40" />
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rareItems.map((item) => (
            <div key={item.id} className="panel-glow p-6 border-[#ff4d4d]/30 bg-[#ff4d4d]/5 space-y-4 hover:bg-[#ff4d4d]/10 transition-colors group">
              <div className="flex items-center justify-between">
                <span className="text-4xl filter drop-shadow-[0_0_12px_rgba(255,77,77,0.5)] group-hover:scale-110 transition-transform">{item.icon}</span>
                <Badge variant="outline" className="border-[#ff4d4d]/40 text-[#ff4d4d] text-[10px] tracking-widest font-display">NÃO FABRICÁVEL</Badge>
              </div>
              <h3 className="font-display text-xl text-white uppercase tracking-wider">{item.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              <div className="pt-2 flex items-center gap-2">
                 <Skull className="h-3 w-3 text-[#ff4d4d]" />
                 <span className="text-[9px] font-display text-[#ff4d4d]/80 uppercase tracking-widest">Drop Raro: Rodadas PvE (2-4%)</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTO DIVINO & UPGRADE */}
      <section className="container py-12">
        <div className="relative p-12 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/20 via-background to-purple-900/40 overflow-hidden group">
          {/* Background visuals */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/10 blur-[100px] rounded-full -mr-40 -mt-20 group-hover:bg-gold/20 transition-all duration-1000" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[80px] rounded-full -ml-20 -mb-20" />
          
          <div className="grid lg:grid-cols-2 gap-12 relative z-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gold text-black font-display text-xs font-bold tracking-[0.2em]">
                <Crown className="h-3 w-3" /> EVENTO: CHAMADO DOS DEUSES
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight">
                A <span className="text-gold text-glow">ASCENSÃO DIVINA</span> CHEGOU.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Quando restarem apenas 3 jogadores na Arena, os Deuses concedem um favor único. Transforme seu hardware padrão em artefatos de poder imensurável.
              </p>
              
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full border border-gold/60 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-gold text-[10px] font-bold">1</span>
                    </div>
                    <p className="text-sm text-gold/90"><span className="font-bold">Limite:</span> Máximo de 1 upgrade divino por jogador por partida.</p>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full border border-gold/60 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-gold text-[10px] font-bold">2</span>
                    </div>
                    <p className="text-sm text-gold/90"><span className="font-bold">Upgrade:</span> Atributos base dobrados + Aura de 15% para aliados próximos.</p>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full border border-gold/60 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-gold text-[10px] font-bold">3</span>
                    </div>
                    <p className="text-sm text-gold/90"><span className="font-bold">Decisão:</span> O upgrade é irreversível. Escolha o item que definirá sua vitória.</p>
                 </div>
              </div>
            </div>

            <div className="panel p-8 border-gold/30 bg-black/40 backdrop-blur-xl relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
               <div className="relative z-10 text-center space-y-6">
                  <div className="flex items-center justify-center gap-4">
                     <div className="h-16 w-16 rounded border border-primary/30 bg-primary/5 flex items-center justify-center text-3xl">⚔️⚔️</div>
                     <Plus className="h-6 w-6 text-gold" />
                     <div className="h-16 w-16 rounded-full border-2 border-gold bg-gold/10 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(255,184,0,0.4)] animate-pulse">✨</div>
                  </div>
                  <div className="h-8 flex justify-center">
                    <History className="h-8 w-8 text-gold rotate-90" />
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="text-6xl mb-2 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">🌌⚔️</div>
                     <h3 className="font-display text-2xl text-gold font-black tracking-widest">LÂMINA DOS DEUSES</h3>
                     <p className="text-xs text-purple-300 font-display tracking-widest mt-1">TIER DIVINO · ARTEFATO FINAL</p>
                  </div>
                  <div className="pt-4 border-t border-gold/20 grid grid-cols-2 gap-4">
                     <div>
                       <div className="text-[9px] text-muted-foreground uppercase">Atributos</div>
                       <div className="text-gold font-bold">DOUBLE (+200%)</div>
                     </div>
                     <div>
                       <div className="text-[9px] text-muted-foreground uppercase">Habilidade</div>
                       <div className="text-gold font-bold">NOVO EFEITO</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ITENS DIVINOS (EXEMPLOS) */}
      <section className="container py-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/40 pb-6">
          <div className="space-y-1">
            <h2 className="font-display text-3xl font-bold uppercase text-gold">Manifestações <span className="text-white">Divinas</span></h2>
            <p className="text-sm text-gold/80 font-display tracking-wider">UPGRADES LENDÁRIOS PARA CADA EQUIPAMENTO</p>
          </div>
          <div className="flex items-center gap-4 px-4 py-2 rounded bg-gold/10 border border-gold/40 text-[10px] font-display text-gold uppercase tracking-widest">
             <Star className="h-3 w-3 fill-gold" /> 15% bônus de status global em aura
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {divineItems.slice(0, 9).map((item) => (
            <div key={item.id} className="panel p-6 space-y-4 border-purple-500/30 bg-purple-950/10 hover:border-gold/60 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 transform group-hover:scale-[2] transition-transform duration-700">
                <Sparkles className="h-12 w-12 text-gold" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,184,0,0.5)]">{item.icon}</span>
                <div>
                  <h3 className="font-display text-lg text-white font-bold tracking-tight uppercase group-hover:text-gold transition-colors">{item.name}</h3>
                  <div className="text-[9px] text-gold font-display tracking-[0.2em]">TRANSFORMAÇÃO DIVINA</div>
                </div>
              </div>
              
              <p className="text-xs text-purple-100/70 leading-relaxed font-display relative z-10 h-10 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-purple-500/20 relative z-10">
                 <div className="text-[10px] font-display text-gold uppercase tracking-tighter">Status x2</div>
                 <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                 <div className="text-[10px] font-display text-gold uppercase tracking-tighter">Habilidade ++</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-8">
           <p className="text-muted-foreground font-display text-sm tracking-widest italic">
             +12 OUTRAS MANIFESTAÇÕES CATALOGADAS NO CORE DO SISTEMA
           </p>
        </div>
      </section>

      {/* RODAPÉ DE UX */}
      <section className="container py-12">
        <div className="panel p-8 bg-card border-dashed flex flex-col md:flex-row items-center gap-8 justify-between">
           <div className="space-y-2 max-w-xl text-center md:text-left">
              <h4 className="font-display text-xl font-bold uppercase text-primary">Dica para o Mestre da Arena</h4>
              <p className="text-sm text-muted-foreground">
                O meta do A.o.G é dinâmico. Itens com tags <span className="text-primary font-bold">Ofensivas</span> devem ir para Assassinos, enquanto <span className="text-accent font-bold">Defensivas</span> salvaguardam seus Tanques. O item divino é o único que pode quebrar essa regra, permitindo que um Assassino sobreviva o suficiente para limpar o tabuleiro.
              </p>
           </div>
           <Link to="/champions">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display tracking-widest px-8">
                ESTUDAR SINERGIAS
              </Button>
           </Link>
        </div>
      </section>
    </div>
  );
}
