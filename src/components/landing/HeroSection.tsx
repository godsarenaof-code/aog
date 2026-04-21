import logo from "@/assets/aog-logo.png";
import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureModal } from "./LeadCaptureModal";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 min-h-screen flex items-center">
      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs font-display tracking-[0.3em] text-primary">
            <Sparkles className="h-3 w-3" />
            GARANTA A SKIN KAEL - PROTOCOLO ZERO
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05]">
            <span className="text-cyan text-glow uppercase">A Ascensão Digital</span>
            <br />
            <span className="text-foreground uppercase">Começou.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Domine a Arena ou torne-se obsoleto. Crie sinergias invencíveis,
            posicione suas unidades e prove seu valor no auto battler definitivo.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <div className="w-fit">
              <LeadCaptureModal>
                 <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow font-display tracking-wider px-8 animate-pulse-glow group">
                  GARANTIR ACESSO ANTECIPADO
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </LeadCaptureModal>
            </div>
            <p className="text-xs text-muted-foreground mt-2 pl-2">
              * Inscreva-se agora e ganhe a Skin Exclusiva: Kael - Protocolo Zero
            </p>
          </div>
        </div>
        <div className="relative animate-float pointer-events-none hidden lg:block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <img src={logo} alt="A.O.G — Arena of Gods" className="relative w-full max-w-xl mx-auto drop-shadow-[0_0_60px_hsl(var(--primary)/0.4)]" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(transparent_50%,hsl(var(--primary)/0.05)_50%)] bg-[length:100%_4px]" />
    </section>
  );
}
