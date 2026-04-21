import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import logo from "@/assets/aog-logo.png";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { GameplaySection } from "@/components/landing/GameplaySection";
import { EncyclopediaSection } from "@/components/landing/EncyclopediaSection";
import { SystemsSection } from "@/components/landing/SystemsSection";
import { ArsenalSection } from "@/components/landing/ArsenalSection";

const Landing = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

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
