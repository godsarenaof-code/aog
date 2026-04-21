import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Trophy } from "lucide-react";

interface LeadCaptureModalProps {
  children: React.ReactNode;
}

export function LeadCaptureModal({ children }: LeadCaptureModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating referal source capture via URL
    const params = new URLSearchParams(window.location.search);
    const referral = params.get('utm_source') || 'organic';

    try {
      const { error } = await supabase.from("pre_registrations").insert([
        { name, email, referral_source: referral }
      ] as any);
      
      if (error) {
        if (error.code === '23505') {
          toast.info("Este e-mail já está registrado na lista de espera!");
        } else {
          toast.error("Erro ao registrar. Tente novamente mais tarde.");
        }
      } else {
        toast.success("Acesso garantido! Fique de olho no seu e-mail.");
        setOpen(false);
      }
    } catch (err) {
      toast.error("Algo deu errado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-primary/40 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-cyanflex items-center gap-2">
            A ASCENSÃO COMEÇOU
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            Increva-se agora e ganhe a Skin Exclusiva: <span className="text-primary font-bold">Kael - Protocolo Zero</span> no lançamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome (Opcional)</Label>
            <Input 
              id="name" 
              placeholder="Ex: PlayerZero" 
              className="border-primary/20 bg-background focus-visible:ring-primary/50" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              placeholder="seu@email.com" 
              className="border-primary/20 bg-background focus-visible:ring-primary/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow font-display tracking-wide uppercase font-bold mt-2 h-12">
            {loading ? "Processando..." : "Garantir Skin & Acesso"}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
            <Trophy className="h-3 w-3 text-gold" /> Junte-se a centenas de jogadores na lista.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
