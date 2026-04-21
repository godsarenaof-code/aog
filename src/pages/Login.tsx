import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import logo from "@/assets/aog-logo.png";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === "login" ? "Acesso autorizado, Invocador." : "Conta criada. Bem-vindo à Arena.");
    navigate("/lobby");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex items-center justify-center p-12 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative text-center space-y-6 animate-fade-in">
          <img src={logo} alt="A.O.G" className="w-80 mx-auto drop-shadow-[0_0_60px_hsl(var(--primary)/0.5)] animate-float" />
          <div>
            <div className="text-xs font-display tracking-[0.4em] text-accent mb-2">// PRE-ALPHA</div>
            <p className="text-muted-foreground max-w-md mx-auto">
              "Os deuses não nascem. São forjados na arena."
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:text-left">
            <Link to="/" className="font-display text-xs tracking-[0.3em] text-muted-foreground hover:text-primary">← VOLTAR</Link>
            <h1 className="font-display text-3xl font-bold mt-4">
              {mode === "login" ? <>ENTRE NA <span className="text-cyan">ARENA</span></> : <>CRIE SEU <span className="text-gold">LEGADO</span></>}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              {mode === "login" ? "Acesse sua conta de Invocador." : "Junte-se aos deuses em ascensão."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="font-display text-xs tracking-widest">NOME DE INVOCADOR</Label>
                <Input id="name" required placeholder="Aether_01" className="bg-card/60 border-border/60 font-body" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-display text-xs tracking-widest">EMAIL</Label>
              <Input id="email" type="email" required placeholder="invocador@aog.gg" className="bg-card/60 border-border/60 font-body" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-display text-xs tracking-widest">SENHA</Label>
              <Input id="password" type="password" required placeholder="••••••••" className="bg-card/60 border-border/60 font-body" />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow font-display tracking-widest">
              {mode === "login" ? "ENTRAR" : "CRIAR CONTA"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-primary hover:text-primary-glow font-display tracking-wider"
            >
              {mode === "login" ? "REGISTRAR" : "ENTRAR"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
