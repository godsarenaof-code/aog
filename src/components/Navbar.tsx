import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/aog-logo.png";
import { LeadCaptureModal } from "@/components/landing/LeadCaptureModal";

export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="A.O.G logo" className="h-9 w-9 object-contain drop-shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
          <span className="font-display font-bold text-cyan text-lg hover:text-white transition-colors">A.O.G</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-display tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
          <Link to="/champions" className="hover:text-primary transition-colors">CAMPEÕES</Link>
          <Link to="/items" className="hover:text-primary transition-colors">ITENS</Link>
          <Link to="/simulator" className="hover:text-primary transition-colors text-cyan">SIMULADOR</Link>
          <Link to="/lore" className="hover:text-primary transition-colors">HISTÓRIA</Link>
          <Link to="/patch-notes" className="hover:text-primary transition-colors">PATCH NOTES</Link>
        </div>
        <LeadCaptureModal>
           <Button variant="outline" className="border-primary/60 text-primary hover:bg-primary/10 font-display tracking-wider hidden sm:flex">
             GARANTIR ACESSO
           </Button>
        </LeadCaptureModal>
      </div>
    </nav>
  );
}
