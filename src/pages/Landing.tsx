import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Swords, Zap, Trophy, Users, ChevronRight, Shield, Sparkles } from "lucide-react";
import logo from "@/assets/aog-logo.png";

const features = [
  { icon: Swords, title: "Combate Auto", desc: "Posicione, sinergize e veja seu time conquistar a Arena dos Deuses." },
  { icon: Zap, title: "Sinergias Únicas", desc: "10 traços (5 Origens + 5 Classes) com builds infinitas." },
  { icon: Trophy, title: "Ranked Sazonal", desc: "Suba do Aço ao Divino. Recompensas exclusivas a cada temporada." },
  { icon: Users, title: "Clãs & Eventos", desc: "Forme alianças, dispute torneios semanais e domine o leaderboard." },
];

const roadmap = [
  { phase: "Fase 1", title: "Pré-Alpha", status: "ATIVO", items: ["Core loop", "16 unidades base", "8 sinergias"] },
  { phase: "Fase 2", title: "Alpha Fechado", status: "Q3", items: ["Multiplayer 8p", "Ranked", "Sistema de runas"] },
  { phase: "Fase 3", title: "Beta Aberto", status: "Q4", items: ["Clãs", "Battle Pass", "Modo torneio"] },
  { phase: "Fase 4", title: "Lançamento", status: "2027", items: ["Esports", "Cross-platform", "Mobile"] },
];

const Landing = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="A.O.G logo" className="h-9 w-9 object-contain drop-shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
            <span className="font-display font-bold text-cyan text-lg">A.O.G</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-display tracking-widest text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">FEATURES</a>
            <Link to="/champions" className="hover:text-primary transition-colors">PERSONAGENS</Link>
            <a href="#roadmap" className="hover:text-primary transition-colors">ROADMAP</a>
            <Link to="/lobby" className="hover:text-primary transition-colors">JOGAR</Link>
          </div>
          <Link to="/login">
            <Button variant="outline" className="border-primary/60 text-primary hover:bg-primary/10 font-display tracking-wider">
              ENTRAR
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 min-h-screen flex items-center">
        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs font-display tracking-[0.3em] text-primary">
              <Sparkles className="h-3 w-3" />
              PRE-ALPHA · DESCUBRA O PROJETO
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05]">
              <span className="text-cyan text-glow">ARENA</span>
              <br />
              <span className="text-foreground">OF</span>{" "}
              <span className="text-gold">GODS</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Um auto battler futurista de estratégia e sinergia. Construa o time perfeito,
              domine o tabuleiro hexagonal e ascenda ao trono divino da arena.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/lobby">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow font-display tracking-wider px-8">
                  JOGAR AGORA
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#roadmap">
                <Button size="lg" variant="outline" className="border-accent/60 text-accent hover:bg-accent/10 font-display tracking-wider">
                  VER ROADMAP
                </Button>
              </a>
            </div>
            <div className="flex gap-8 pt-6 text-sm">
              <div><div className="font-display text-2xl text-cyan">10</div><div className="text-muted-foreground">Sinergias</div></div>
              <div><div className="font-display text-2xl text-cyan">21</div><div className="text-muted-foreground">Unidades</div></div>
              <div><div className="font-display text-2xl text-cyan">8</div><div className="text-muted-foreground">Jogadores</div></div>
            </div>
          </div>
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <img src={logo} alt="A.O.G — Arena of Gods" className="relative w-full max-w-xl mx-auto drop-shadow-[0_0_60px_hsl(var(--primary)/0.4)]" />
          </div>
        </div>
        {/* scanline effect */}
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(transparent_50%,hsl(var(--primary)/0.05)_50%)] bg-[length:100%_4px]" />
      </section>

      {/* FEATURES */}
      <section id="features" className="container py-24">
        <div className="text-center mb-16 space-y-3">
          <div className="text-xs font-display tracking-[0.4em] text-accent">// MECÂNICAS</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">FORJADO PARA <span className="text-cyan">DOMINAR</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="panel p-6 group hover:border-primary/60 transition-all hover:shadow-glow">
              <div className="h-12 w-12 rounded-md bg-gradient-primary/20 border border-primary/40 grid place-items-center mb-4 group-hover:animate-pulse-glow">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="container py-24">
        <div className="text-center mb-16 space-y-3">
          <div className="text-xs font-display tracking-[0.4em] text-accent">// ROADMAP</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">A JORNADA DOS <span className="text-gold">DEUSES</span></h2>
        </div>
        <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {roadmap.map((r, i) => (
            <div key={r.phase} className="panel p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-xs tracking-widest text-muted-foreground">{r.phase}</span>
                <span className={`font-display text-[10px] tracking-widest px-2 py-1 rounded ${i === 0 ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                  {r.status}
                </span>
              </div>
              <h3 className="font-display text-xl mb-3 text-cyan">{r.title}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {r.items.map((it) => (
                  <li key={it} className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-primary shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <div className="panel-glow p-12 text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            PRONTO PARA <span className="text-gold">ASCENDER</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Entre na pré-alpha e ajude a moldar o futuro do A.O.G. Sua lenda começa aqui.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow font-display tracking-wider px-10">
              CRIAR CONTA
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 text-center text-xs font-display tracking-widest text-muted-foreground">
        © 2026 ARENA OF GODS · TODOS OS DIREITOS RESERVADOS
      </footer>
    </div>
  );
};

export default Landing;
