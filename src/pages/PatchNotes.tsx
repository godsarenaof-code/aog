import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { History, Milestone, Rocket, ShieldCheck } from "lucide-react";

const versions = [
  {
    tag: "0.1.1",
    name: "Ascensão Divina & Relíquias",
    date: "21 de Abril, 2026",
    current: true,
    highlights: [
      "Sistema de Upgrade Divino: Transforme itens completos usando a Essência Divina.",
      "Novo Tier de Hardware: 21 versões Divinas com atributos dobrados e auras especiais.",
      "Relíquias do Submundo: Adicionados 4 itens raros (Anjo Guardião, Lâmina Infernal, etc.).",
      "Evento 'Chamado dos Deuses': Nova mecânica de final de jogo para os 3 sobreviventes.",
      "UX Tech: Tags de balanceamento e estética Dourado+Roxo para itens lendários."
    ],
    technical: [
      "Expansão massiva da base de dados central (data.ts).",
      "Refatoração da página de Itens para suportar múltiplos tiers.",
      "Implementação de auras de status e lógica de execução rúnica."
    ]
  },
  {
    tag: "0.1.0",
    name: "Pré-Alpha: A Ascensão Digital",
    date: "21 de Abril, 2026",
    current: false,
    highlights: [
      "Nova Landing Page modularizada e responsiva.",
      "Sistema de pré-inscrição integrado ao Supabase.",
      "Enciclopédia de Campeões com todos os 22 deuses catalogados.",
      "Arsenal Tecnológico com simulador de combinação de itens."
    ]
  },
  {
    tag: "0.0.1",
    name: "Projeto Gênesis",
    date: "10 de Abril, 2026",
    current: false,
    highlights: [
      "Setup inicial do projeto com Vite + React + TS.",
      "Configuração base do design system cyberpunk.",
      "Arquitetura básica de rotas."
    ]
  }
];

export default function PatchNotes() {
  return (
    <div className="min-h-screen pb-24">
      <Navbar />

      <section className="relative pt-32 pb-12">
        <div className="container space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/5 text-xs font-display tracking-[0.3em] text-accent">
            <Milestone className="h-3 w-3" />
            EVOLUÇÃO DA ARENA
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black leading-[1.05]">
            <span className="text-cyan text-glow uppercase">Notas de Atualização</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Acompanhe cada mudança, balanceamento e nova feature adicionada ao ecossistema do Arena of Gods.
          </p>
        </div>
      </section>

      <section className="container py-12 space-y-12">
        {versions.map((v, i) => (
          <div key={v.tag} className={`relative flex gap-8 ${i !== versions.length - 1 ? 'border-l border-border/40 pb-12' : ''} pl-8 ml-4`}>
            {/* Timeline element */}
            <div className={`absolute -left-2.5 top-0 h-5 w-5 rounded-full border-2 bg-background flex items-center justify-center ${v.current ? 'border-primary shadow-[0_0_10px_hsl(var(--primary))]' : 'border-muted'}`}>
               <div className={`h-1.5 w-1.5 rounded-full ${v.current ? 'bg-primary' : 'bg-muted'}`} />
            </div>

            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge variant={v.current ? "default" : "secondary"} className="font-display tracking-[0.2em]">{v.tag}</Badge>
                  <span className="text-sm font-display text-muted-foreground tracking-widest">{v.date.toUpperCase()}</span>
                </div>
                <h3 className="font-display text-2xl text-foreground font-bold">{v.name}</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="panel p-6 border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <Rocket className="h-4 w-4" />
                    <span className="font-display text-xs tracking-widest uppercase">Principais Novidades</span>
                  </div>
                  <ul className="space-y-3">
                    {v.highlights.map((h, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                         <div className="h-1 w-1 bg-primary rounded-full mt-2 shrink-0" />
                         {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {v.technical && (
                  <div className="panel p-6 border-accent/20 bg-accent/5">
                    <div className="flex items-center gap-2 mb-4 text-accent">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="font-display text-xs tracking-widest uppercase">Notas Técnicas</span>
                    </div>
                    <ul className="space-y-3">
                      {v.technical.map((t, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                           <div className="h-1 w-1 bg-accent rounded-full mt-2 shrink-0" />
                           {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="container pt-12">
        <div className="panel p-8 text-center bg-card border-dashed">
          <History className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <p className="font-display text-sm text-muted-foreground tracking-widest">
            FIM DO REGISTRO · NOVAS ATUALIZAÇÕES EM BREVE
          </p>
        </div>
      </section>
    </div>
  );
}
