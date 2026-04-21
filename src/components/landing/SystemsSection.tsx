import { Database, TrendingUp, Star } from "lucide-react";

export function SystemsSection() {
  return (
    <section id="systems" className="container py-24 border-t border-border/40">
      <div className="text-center mb-16 space-y-3">
        <div className="text-xs font-display tracking-[0.4em] text-accent">// MECÂNICAS AVANÇADAS</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">A CIÊNCIA DO <span className="text-cyan">JOGO</span></h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="panel p-8 group hover:border-primary/60 transition-all flex flex-col items-center text-center">
          <Database className="h-10 w-10 text-primary mb-4" />
          <h3 className="font-display text-xl mb-3">Pool Global Restrito</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Se todos compram a mesma unidade, o estoque acaba. O jogo recompensa aqueles que sabem se adaptar ao invés de forçar a mesma composição. Jogue com a escassez.
          </p>
        </div>

        <div className="panel-glow p-8 flex flex-col items-center text-center relative overflow-hidden">
          <Star className="h-10 w-10 text-gold mb-4 relative z-10" />
          <h3 className="font-display text-xl mb-3 text-gold relative z-10">Evolução Ascendente</h3>
          <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
            Combine unidades idênticas para fortalecê-las de forma exponencial:
          </p>
          <div className="mt-6 flex flex-col gap-2 font-display text-sm relative z-10">
            <span className="flex items-center gap-2 justify-center">3x <span className="text-primary">⭐</span> = <span className="text-success">⭐⭐</span></span>
            <span className="flex items-center gap-2 justify-center">3x <span className="text-success">⭐⭐</span> = <span className="text-gold">⭐⭐⭐</span></span>
          </div>
          <div className="absolute inset-0 bg-gold/5 blur-3xl" />
        </div>

        <div className="panel p-8 group hover:border-primary/60 transition-all flex flex-col items-center text-center">
          <TrendingUp className="h-10 w-10 text-cyan mb-4" />
          <h3 className="font-display text-xl mb-3">Pool Dinâmico</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nossa "Bolsa de Valores" viva. Unidades menos usadas pelos jogadores em partidas recentes aparecem mais frequentemente na loja, mantendo o meta sempre fresco.
          </p>
        </div>
      </div>
    </section>
  );
}
