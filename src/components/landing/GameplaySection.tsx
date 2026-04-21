import { LayoutGrid, Layers, Users } from "lucide-react";

export function GameplaySection() {
  return (
    <section id="gameplay" className="container py-24 border-t border-border/40">
      <div className="text-center mb-16 space-y-3">
        <div className="text-xs font-display tracking-[0.4em] text-accent">// O JOGO</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">ESTRATÉGIA PURA EM <span className="text-cyan">28 TILES</span></h2>
        <p className="text-muted-foreground max-w-2xl mx-auto pt-4 leading-relaxed">
          Posicione suas unidades, gerencie sua economia e assista ao combate automático onde apenas os melhores algoritmos sobrevivem.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Placeholder mock for the Grid 7x4 Visual */}
        <div className="relative mx-auto w-full max-w-md aspect-[4/3] panel-glow p-4 flex flex-col justify-center items-center gap-2">
           <div className="grid grid-cols-7 gap-1 w-full flex-1">
             {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/30 transition-colors cursor-pointer clip-hex flex items-center justify-center">
                </div>
             ))}
           </div>
           <div className="w-full flex justify-between mt-4 border-t border-border pt-4">
              <div className="flex gap-2">
                 {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`bench-${i}`} className="w-8 h-8 md:w-10 md:h-10 border border-muted bg-card rounded-md"></div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
          <div className="flex gap-4">
             <div className="h-12 w-12 rounded-md bg-gradient-primary/20 border border-primary/40 shrink-0 grid place-items-center">
                <LayoutGrid className="h-6 w-6 text-primary" />
             </div>
             <div>
               <h3 className="font-display text-xl mb-2 text-foreground">Tabuleiro 7x4</h3>
               <p className="text-sm text-muted-foreground">O campo de batalha é dividido em hexágonos. A posição inicial dita o fim da partida. Proteja suas unidades de longo alcance e avance com seus tanques cibernéticos.</p>
             </div>
          </div>

          <div className="flex gap-4">
             <div className="h-12 w-12 rounded-md bg-gradient-primary/20 border border-primary/40 shrink-0 grid place-items-center">
                <Users className="h-6 w-6 text-primary" />
             </div>
             <div>
               <h3 className="font-display text-xl mb-2 text-foreground">Limite Tático (8 Unidades)</h3>
               <p className="text-sm text-muted-foreground">Você só pode ter 8 campeões em campo simultaneamente no nível máximo. Escolha bem quem levar para o combate.</p>
             </div>
          </div>

          <div className="flex gap-4">
             <div className="h-12 w-12 rounded-md bg-gradient-primary/20 border border-primary/40 shrink-0 grid place-items-center">
                <Layers className="h-6 w-6 text-primary" />
             </div>
             <div>
               <h3 className="font-display text-xl mb-2 text-foreground">Banco de Reservas de 8 Slots</h3>
               <p className="text-sm text-muted-foreground">Adquira heróis e guarde-os no banco de reservas para combiná-los ou mudar a estratégia no meio da rodada quando os oponentes menos esperarem.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
