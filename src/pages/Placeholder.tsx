import { AppLayout } from "@/components/AppLayout";
import { Construction } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Placeholder = ({ title, desc }: { title: string; desc: string }) => (
  <AppLayout>
    <div className="container max-w-3xl py-24 text-center animate-fade-in">
      <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/40 grid place-items-center mx-auto mb-6 animate-pulse-glow">
        <Construction className="h-9 w-9 text-primary" />
      </div>
      <div className="text-xs font-display tracking-[0.4em] text-accent mb-3">// EM DESENVOLVIMENTO</div>
      <h1 className="font-display text-4xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8">{desc}</p>
      <Link to="/lobby">
        <Button variant="outline" className="border-primary/60 text-primary hover:bg-primary/10 font-display tracking-widest">
          VOLTAR AO LOBBY
        </Button>
      </Link>
    </div>
  </AppLayout>
);

export default Placeholder;
