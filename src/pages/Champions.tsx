import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Swords, Shield, Zap, Crown, Sparkles, Coins, Sword, Target, Flame, Droplet, X } from "lucide-react";
import logo from "@/assets/aog-logo.png";

interface Champion {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5;
  origins: string[];
  classes: string[];
  ability: { name: string; mana: number; effect: string };
  desc: string;
}

const champions: Champion[] = [
  // Tier 1
  { id: "kael", name: "Kael", tier: 1, origins: ["Ciborgue"], classes: ["Lâmina"], ability: { name: "Corte Biônico", mana: 60, effect: "Causa 200% de dano físico e aplica sangramento por 3s." }, desc: "Lâmina ciborgue que abre o early game com pressão constante." },
  { id: "m1ra", name: "M1-RA", tier: 1, origins: ["Holográfico"], classes: ["Atirador"], ability: { name: "Disparo Espelhado", mana: 50, effect: "O próximo tiro ricocheteia em 2 inimigos próximos." }, desc: "Principal fonte de dano à distância na fase inicial." },
  { id: "tork", name: "Tork", tier: 1, origins: ["Ciborgue"], classes: ["Sentinela"], ability: { name: "Protocolo Escudo", mana: 70, effect: "Ganha um escudo de 300 HP e atordoa o alvo atual por 1s." }, desc: "Tanque padrão para segurar a linha de frente." },
  { id: "nyx", name: "Nyx", tier: 1, origins: ["Sindicato"], classes: ["Lâmina"], ability: { name: "Golpe de Sorte", mana: 65, effect: "Salta no inimigo com menos vida e causa dano crítico garantido." }, desc: "Assassina do submundo que executa alvos enfraquecidos." },
  { id: "pax", name: "Pax", tier: 1, origins: ["Ascendente"], classes: ["Bastion"], ability: { name: "Meditação Atômica", mana: 80, effect: "Cura 15% da vida máxima e ganha 20 de Armadura (acumulativo)." }, desc: "Monge ascendente que escala defensivamente a cada uso." },
  // Tier 2
  { id: "volt", name: "Volt", tier: 2, origins: ["Ciborgue"], classes: ["Tecnomago"], ability: { name: "Corrente Curta", mana: 60, effect: "Dispara um raio que reduz a mana do alvo em 20 e causa dano mágico." }, desc: "Anti-mago: silencia conjuradores enquanto causa dano." },
  { id: "sombra", name: "Sombra", tier: 2, origins: ["Holográfico"], classes: ["Lâmina"], ability: { name: "Fase de Luz", mana: 75, effect: "Torna-se invisível por 2s e reaparece atrás do inimigo mais distante." }, desc: "Assassina holográfica especialista em alcançar carregadores." },
  { id: "barao", name: "Barão Grivas", tier: 2, origins: ["Sindicato"], classes: ["Sentinela", "Bastion"], ability: { name: "Impacto de Prestígio", mana: 85, effect: "Bate o cajado no chão, reduzindo a Vel. de Atk dos inimigos ao redor." }, desc: "Chefe do Sindicato — controla o ritmo da linha de frente." },
  { id: "lyra", name: "Lyra", tier: 2, origins: ["Ascendente"], classes: ["Atirador"], ability: { name: "Flecha de Fóton", mana: 70, effect: "Atira um feixe que atravessa o mapa, causando dano a todos no caminho." }, desc: "Sniper ascendente perfeita para inimigos enfileirados." },
  { id: "nanobit", name: "Nano-Bit", tier: 2, origins: [], classes: ["Tecnomago", "Sentinela"], ability: { name: "Reparo Nanométrico", mana: 70, effect: "Libera enxame de nanobots que cura o aliado mais ferido em 250 HP." }, desc: "Suporte técnico — ponte entre Tecnomagos e a linha de frente." },
  // Tier 3
  { id: "astra", name: "Astra", tier: 3, origins: ["Holográfico"], classes: ["Tecnomago"], ability: { name: "Nebulosa Digital", mana: 90, effect: "Cria uma área de dano contínuo e gera 1 clone para cada inimigo morto ali." }, desc: "Conjuradora de área que escala com kills consecutivas." },
  { id: "vector", name: "Vector", tier: 3, origins: ["Ciborgue"], classes: ["Atirador"], ability: { name: "Modo Artilharia", mana: 80, effect: "Fica imóvel e ganha +100% de Vel. de Atk por 5 segundos." }, desc: "Torre de fogo cibernética para sustained damage." },
  { id: "titan", name: "Titan", tier: 3, origins: [], classes: ["Sentinela", "Bastion"], ability: { name: "Cúpula Alpha", mana: 100, effect: "Cria uma barreira que bloqueia todos os projéteis inimigos por 3s." }, desc: "Anti-atiradores definitivo. Domina rounds com burst à distância." },
  { id: "zane", name: "Zane", tier: 3, origins: ["Ciborgue", "Sindicato"], classes: ["Lâmina"], ability: { name: "Turbilhão de Créditos", mana: 75, effect: "Gira as lâminas; se matar alguém, gera 1 ouro (máx. 2 por round)." }, desc: "A unidade mais disputada — economia + combate em um pacote." },
  { id: "cybermonk", name: "Cyber-Monk", tier: 3, origins: ["Ascendente"], classes: ["Bastion"], ability: { name: "Palma de Plasma", mana: 85, effect: "Empurra o alvo para o final do grid e o atordoa por 2.5s." }, desc: "Disruptor de posicionamento — reorganiza qualquer comp inimiga." },
  // Tier 4
  { id: "nova", name: "Nova", tier: 4, origins: ["Ascendente"], classes: ["Tecnomago"], ability: { name: "Colapso Estelar", mana: 120, effect: "Invoca um meteoro com dano massivo em área e queima 50% da mana dos atingidos." }, desc: "Wipe mágico que silencia conjuradores inimigos no impacto." },
  { id: "helius", name: "Helius", tier: 4, origins: ["Ciborgue"], classes: ["Sentinela"], ability: { name: "Núcleo de Fusão", mana: 110, effect: "Explode em energia, curando aliados e causando dano (baseado na vida máx dele)." }, desc: "Tank-suporte híbrido — quanto mais HP, mais devastador." },
  { id: "luna", name: "Luna", tier: 4, origins: ["Holográfico"], classes: ["Atirador", "Tecnomago"], ability: { name: "Lua Binária", mana: 90, effect: "Alterna tiros físicos (azul) e mágicos (roxo), ignorando 40% das resistências." }, desc: "Carregadora flexível — escala com itens AD ou AP." },
  { id: "dravenx", name: "Draven-X", tier: 4, origins: ["Sindicato"], classes: ["Lâmina"], ability: { name: "Lâmina de Retorno", mana: 80, effect: "Lança um disco com dano na ida e volta. Dano aumenta a cada retorno pego." }, desc: "Alto risco, alta recompensa do Sindicato." },
  // Tier 5
  { id: "zeus01", name: "Zeus-01", tier: 5, origins: ["Deidade"], classes: ["Tecnomago"], ability: { name: "Julgamento Binário", mana: 150, effect: "Relâmpagos caem em todos os inimigos. Inimigos acima de 80% de HP são atordoados." }, desc: "IA divina de controle global — pune comps de tank stacking." },
  { id: "ares", name: "Ares", tier: 5, origins: ["Deidade"], classes: ["Lâmina", "Bastion"], ability: { name: "Ira de Marte", mana: 130, effect: "Entra em frenesi: 100% de roubo de vida e ataques causam dano em área." }, desc: "Um exército de um homem só. Impossível de ignorar." },
  { id: "gaia", name: "Gaia", tier: 5, origins: ["Deidade"], classes: ["Sentinela"], ability: { name: "Reforma da Terra", mana: 140, effect: "Transforma o chão em nanobots que regeneram 100% da vida de um aliado por segundo." }, desc: "Cura divina — mantém o carry vivo contra qualquer burst." },
];

const origins = [
  { name: "Holográficos", levels: "2 / 4", desc: "(2) Cria clone com 30% HP. (4) Clone causa 60% de dano." },
  { name: "Ciborgues", levels: "2 / 4 / 6", desc: "Ganham 200/400/700 de Escudo de Energia e 15% de Dano de Ataque." },
  { name: "Ascendentes", levels: "3 / 5", desc: "A cada 2s, ganham +5% de dano (acumula até o fim da rodada)." },
  { name: "Sindicato", levels: "2", desc: "Vencer = +1 Ouro. Perder = próximo Roll custa 1." },
  { name: "Deidades", levels: "1", desc: "+15% de status para cada Elo acima de Mortal. Sem bônus de grupo." },
];

const classes = [
  { name: "Lâminas", levels: "2 / 4 / 6", desc: "(2) 15% chance de ataque duplo. (4) 30%. (6) 50% + Crítico.", icon: Sword },
  { name: "Sentinelas", levels: "2 / 4", desc: "(2) +40 Armadura. (4) Aliados adjacentes ganham 50% dessa armadura.", icon: Shield },
  { name: "Tecnomagos", levels: "2 / 4", desc: "(2) +20% Poder de Magia. (4) Curam 15% do dano causado por magias.", icon: Sparkles },
  { name: "Atiradores", levels: "2 / 4", desc: "(2) +1 de Range. (4) Cada ataque aumenta Vel. Atk em 5%.", icon: Target },
  { name: "Bastions", levels: "2 / 3", desc: "(2) 20% de Redução de Dano. (3) 40%.", icon: Flame },
];

const tierConfig = {
  1: { color: "text-muted-foreground", border: "border-muted", bg: "bg-muted/20", label: "T1" },
  2: { color: "text-success", border: "border-success/60", bg: "bg-success/10", label: "T2" },
  3: { color: "text-cyan", border: "border-cyan/60", bg: "bg-cyan/10", label: "T3" },
  4: { color: "text-accent", border: "border-accent/60", bg: "bg-accent/10", label: "T4" },
  5: { color: "text-gold", border: "border-gold/60", bg: "bg-gradient-gold/10", label: "T5" },
} as const;

const allTraits = [
  { name: "Ciborgue", kind: "origin" as const, icon: "⚙️" },
  { name: "Holográfico", kind: "origin" as const, icon: "👤" },
  { name: "Sindicato", kind: "origin" as const, icon: "💰" },
  { name: "Ascendente", kind: "origin" as const, icon: "✨" },
  { name: "Deidade", kind: "origin" as const, icon: "⚡" },
  { name: "Lâmina", kind: "class" as const, icon: "⚔️" },
  { name: "Sentinela", kind: "class" as const, icon: "🛡️" },
  { name: "Tecnomago", kind: "class" as const, icon: "🧪" },
  { name: "Atirador", kind: "class" as const, icon: "🏹" },
  { name: "Bastion", kind: "class" as const, icon: "🧱" },
];

const viability = [
  { trait: "Lâminas", icon: "⚔️", count: 6, max: "2/4/6", note: "Kael, Nyx, Sombra, Zane, Draven-X, Ares. Bônus máx (6) sem margem — todos necessários ou use Espátula." },
  { trait: "Tecnomagos", icon: "🧪", count: 6, max: "2/4", note: "Volt, Nano-Bit, Astra, Nova, Luna, Zeus-01. Bônus máx (4) é confortável — sobram 2 de margem." },
  { trait: "Ciborgues", icon: "⚙️", count: 6, max: "2/4/6", note: "Kael, Tork, Volt, Vector, Zane, Helius. Pivote para (4) é seguro." },
  { trait: "Sentinelas", icon: "🛡️", count: 6, max: "2/4", note: "Tork, Barão, Nano-Bit, Titan, Helius, Gaia. Bônus (4) tem 2 unidades de folga." },
  { trait: "Bastions", icon: "🧱", count: 5, max: "2/3", note: "Pax, Barão, Titan, Cyber-Monk, Ares. Bônus máx (3) é trivial de fechar." },
  { trait: "Atiradores", icon: "🏹", count: 4, max: "2/4", note: "M1-RA, Lyra, Vector, Luna. Bônus máx (4) requer todos — comp dedicada." },
];

const Champions = () => {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? champions.filter((c) => c.origins.includes(active) || c.classes.includes(active)) : champions),
    [active]
  );

  const grouped = [1, 2, 3, 4, 5].map((t) => ({
    tier: t as 1 | 2 | 3 | 4 | 5,
    units: filtered.filter((c) => c.tier === t),
  }));

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="A.O.G logo" className="h-9 w-9 object-contain drop-shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
            <span className="font-display font-bold text-cyan text-lg">A.O.G</span>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm" className="border-primary/60 text-primary hover:bg-primary/10 font-display tracking-wider">
              <ChevronLeft className="h-4 w-4" /> VOLTAR
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-12">
        <div className="container space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs font-display tracking-[0.3em] text-primary">
            <Crown className="h-3 w-3" />
            ELENCO DE LANÇAMENTO
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black leading-[1.05]">
            <span className="text-cyan text-glow">22 DEUSES</span>
            <br />
            <span className="text-foreground">PRONTOS PARA A</span>{" "}
            <span className="text-gold">ARENA</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Conheça as unidades, sinergias e estratégias do Pré-Alpha. Combine origens e classes
            para forjar composições devastadoras.
          </p>
          <div className="flex gap-8 pt-4 text-sm">
            <div><div className="font-display text-2xl text-cyan">22</div><div className="text-muted-foreground">Unidades</div></div>
            <div><div className="font-display text-2xl text-cyan">5</div><div className="text-muted-foreground">Origens</div></div>
            <div><div className="font-display text-2xl text-cyan">5</div><div className="text-muted-foreground">Classes</div></div>
            <div><div className="font-display text-2xl text-gold">5</div><div className="text-muted-foreground">Tiers</div></div>
          </div>
        </div>
      </section>

      {/* SINERGIAS */}
      <section className="container py-16 space-y-10">
        <div className="space-y-3">
          <div className="text-xs font-display tracking-[0.4em] text-accent">// MATRIZ DE SINERGIAS</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold">ORIGENS & <span className="text-cyan">CLASSES</span></h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="font-display text-sm tracking-[0.3em] text-primary">// ORIGENS</h3>
            <div className="space-y-2">
              {origins.map((o) => (
                <div key={o.name} className="panel p-4 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-md bg-gradient-primary/20 border border-primary/40 grid place-items-center shrink-0">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="font-display text-base">{o.name}</span>
                      <span className="font-display text-xs text-cyan tracking-widest">{o.levels}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-sm tracking-[0.3em] text-accent">// CLASSES</h3>
            <div className="space-y-2">
              {classes.map((c) => (
                <div key={c.name} className="panel p-4 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-md bg-gradient-gold/20 border border-accent/40 grid place-items-center shrink-0">
                    <c.icon className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="font-display text-base">{c.name}</span>
                      <span className="font-display text-xs text-accent tracking-widest">{c.levels}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CAMPEÕES POR TIER */}
      <section className="container py-12 space-y-8">
        <div className="space-y-3">
          <div className="text-xs font-display tracking-[0.4em] text-accent">// ELENCO COMPLETO</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold">CAMPEÕES POR <span className="text-gold">TIER</span></h2>
          <p className="text-sm text-muted-foreground">Filtre por sinergia para ver quais unidades pertencem a cada origem ou classe.</p>
        </div>

        {/* FILTRO DE SINERGIAS */}
        <div className="panel p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs tracking-[0.3em] text-primary">// FILTRAR POR SINERGIA</span>
            {active && (
              <button
                onClick={() => setActive(null)}
                className="flex items-center gap-1 text-xs font-display tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" /> LIMPAR
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTraits.map((t) => {
              const isActive = active === t.name;
              const isOrigin = t.kind === "origin";
              return (
                <button
                  key={t.name}
                  onClick={() => setActive(isActive ? null : t.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-display text-xs tracking-wider border transition-all ${
                    isActive
                      ? isOrigin
                        ? "bg-primary/20 border-primary text-primary shadow-glow"
                        : "bg-accent/20 border-accent text-accent shadow-glow"
                      : isOrigin
                        ? "border-primary/30 text-primary/70 hover:border-primary/60 hover:text-primary"
                        : "border-accent/30 text-accent/70 hover:border-accent/60 hover:text-accent"
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.name.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {grouped.filter((g) => g.units.length > 0).map(({ tier, units }) => {
          const cfg = tierConfig[tier];
          return (
            <div key={tier} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`font-display text-2xl font-bold ${cfg.color}`}>TIER {tier}</span>
                <div className={`h-px flex-1 ${cfg.border} border-t`} />
                <span className="font-display text-xs tracking-widest text-muted-foreground">
                  {units.length} {units.length === 1 ? "UNIDADE" : "UNIDADES"}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {units.map((u) => (
                  <div
                    key={u.id}
                    className={`panel p-5 hover:shadow-glow transition-all hover:-translate-y-1 ${cfg.border}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`h-14 w-14 rounded-md ${tier >= 4 ? "bg-gradient-gold" : "bg-gradient-primary"} grid place-items-center`}>
                        <span className="font-display text-2xl font-black text-primary-foreground">
                          {u.name[0]}
                        </span>
                      </div>
                      <span className={`font-display text-[10px] tracking-widest px-2 py-1 rounded ${cfg.bg} ${cfg.color} flex items-center gap-1`}>
                        <Coins className="h-3 w-3" />{tier}
                      </span>
                    </div>
                    <h3 className="font-display text-lg mb-1">{u.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {u.origins.map((o) => (
                        <span key={o} className="text-[10px] font-display tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
                          {o}
                        </span>
                      ))}
                      {u.classes.map((c) => (
                        <span key={c} className="text-[10px] font-display tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/30">
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{u.desc}</p>
                    <div className="border-t border-border/60 pt-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Sparkles className="h-3 w-3 text-cyan shrink-0" />
                          <span className="font-display text-xs text-cyan truncate">{u.ability.name}</span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-display text-primary shrink-0">
                          <Droplet className="h-3 w-3" />{u.ability.mana}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">{u.ability.effect}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* VIABILIDADE */}
      <section className="container py-16 space-y-6">
        <div className="space-y-3">
          <div className="text-xs font-display tracking-[0.4em] text-accent">// CHECK DE SINERGIA</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold">ANÁLISE DE <span className="text-cyan">VIABILIDADE</span></h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Quantas unidades existem por sinergia e qual a margem de pivote para fechar cada bônus máximo.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {viability.map((v) => (
            <div key={v.trait} className="panel p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{v.icon}</span>
                  <span className="font-display text-lg">{v.trait}</span>
                </div>
                <span className="font-display text-xs tracking-widest text-cyan">{v.max}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-black text-gold">{v.count}</span>
                <span className="text-xs font-display tracking-wider text-muted-foreground">UNIDADES</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.note}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="container py-16">
        <div className="panel-glow p-10 text-center space-y-5 max-w-2xl mx-auto">
          <Swords className="h-10 w-10 text-primary mx-auto" />
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            ESCOLHA SEUS <span className="text-cyan">CAMPEÕES</span>
          </h2>
          <p className="text-muted-foreground">
            Entre na arena e teste suas composições no Pré-Alpha.
          </p>
          <Link to="/lobby">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow font-display tracking-wider px-8">
              JOGAR AGORA
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

export default Champions;
