import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/aog-logo.png";
import { LeadCaptureModal } from "@/components/landing/LeadCaptureModal";
import { HeroSection } from "@/components/landing/HeroSection";
import { GameplaySection } from "@/components/landing/GameplaySection";
import { EncyclopediaSection } from "@/components/landing/EncyclopediaSection";
import { SystemsSection } from "@/components/landing/SystemsSection";
import { ArsenalSection } from "@/components/landing/ArsenalSection";

const Landing = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="A.O.G logo" className="h-9 w-9 object-contain drop-shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
            <span className="font-display font-bold text-cyan text-lg hover:text-white transition-colors">A.O.G</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-display tracking-widest text-muted-foreground">
            <a href="#gameplay" className="hover:text-primary transition-colors">O JOGO</a>
            <a href="#encyclopedia" className="hover:text-primary transition-colors">ENCICLOPÉDIA</a>
            <a href="#systems" className="hover:text-primary transition-colors">SISTEMAS</a>
            <a href="#arsenal" className="hover:text-primary transition-colors">ARSENAL</a>
          </div>
          <LeadCaptureModal>
             <Button variant="outline" className="border-primary/60 text-primary hover:bg-primary/10 font-display tracking-wider hidden sm:flex">
               GARANTIR ACESSO
             </Button>
          </LeadCaptureModal>
        </div>
      </nav>

      <HeroSection />
      <GameplaySection />
      <EncyclopediaSection />
      <SystemsSection />
      <ArsenalSection />

      <footer className="border-t border-border/40 py-12 text-center text-xs font-display tracking-widest text-muted-foreground space-y-4">
        <div className="flex justify-center mb-4">
           <img src={logo} alt="A.O.G logo" className="h-12 w-12 object-contain opacity-50 grayscale hover:grayscale-0 transition-all hover:opacity-100" />
        </div>
        <p>© 2026 ARENA OF GODS · TODOS OS DIREITOS RESERVADOS</p>
        <p className="opacity-50">Domine a Arena ou Torne-se Obsoleto.</p>
      </footer>
    </div>
  );
};

export default Landing;
