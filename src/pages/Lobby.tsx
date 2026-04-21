import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Swords, Zap, Trophy, Users, Play } from "lucide-react";
import { Link } from "react-router-dom";

const modes = [
  { icon: Swords, title: "Partida Normal", desc: "8 jogadores · Sem ranking", color: "primary", to: "/match" },
  { icon: Trophy, title: "Ranked", desc: "Suba a classificação sazonal", color: "accent", to: "/match" },
  { icon: Zap, title: "Hyper Roll", desc: "Modo rápido · 15 min", color: "primary", to: "/match" },
  { icon: Users, title: "Duplas", desc: "Jogue com um aliado", color: "accent", to: "/match" },
];

const news = [
  { tag: "PATCH 0.1.4", title: "Rebalanceamento de sinergias Cibernéticas", date: "Há 2 dias" },
  { tag: "EVENTO", title: "Torneio Inaugural — inscrições abertas", date: "Há 5 dias" },
  { tag: "DEV BLOG", title: "Como projetamos o sistema de runas", date: "Há 1 semana" },
];

const Lobby = () => (
  <AppLayout>
    <div className="container max-w-7xl py-8 space-y-8 animate-fade-in">
      <div>
        <div className="text-xs font-display tracking-[0.4em] text-accent">// LOBBY</div>
        <h1 className="font-display text-4xl font-bold mt-2">
          BEM-VINDO, <span className="text-cyan">INVOCADOR</span>
        </h1>
        <p className="text-muted-foreground mt-1">Selecione um modo e mergulhe na Arena.</p>
      </div>

      {/* Quick play */}
      <div className="panel-glow p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs font-display tracking-[0.3em] text-primary mb-2">JOGAR AGORA</div>
          <h2 className="font-display text-2xl font-bold">Partida Rápida</h2>
          <p className="text-sm text-muted-foreground">Encontre a próxima partida disponível em segundos.</p>
        </div>
        <Link to="/match">
          <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow font-display tracking-widest px-10">
            <Play className="mr-2 h-4 w-4 fill-current" /> ENTRAR NA FILA
          </Button>
        </Link>
      </div>

      {/* Modes */}
      <div>
        <h2 className="font-display text-xl mb-4 text-muted-foreground tracking-widest">MODOS DE JOGO</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((m) => (
            <Link key={m.title} to={m.to} className="panel p-5 hover:border-primary/60 hover:shadow-glow transition-all group">
              <div className={`h-10 w-10 rounded-md grid place-items-center mb-3 ${m.color === "accent" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"} group-hover:animate-pulse-glow`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-base">{m.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* News */}
      <div>
        <h2 className="font-display text-xl mb-4 text-muted-foreground tracking-widest">NOTÍCIAS DA ARENA</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {news.map((n) => (
            <article key={n.title} className="panel p-5 hover:border-accent/60 transition-colors cursor-pointer">
              <div className="text-[10px] font-display tracking-widest text-accent mb-2">{n.tag}</div>
              <h3 className="font-display text-base mb-3">{n.title}</h3>
              <div className="text-xs text-muted-foreground">{n.date}</div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Lobby;
