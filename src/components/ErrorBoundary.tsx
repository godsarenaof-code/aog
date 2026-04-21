import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="h-10 w-10 text-red-500 animate-pulse" />
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="font-display text-2xl font-bold uppercase tracking-widest text-white">Erro no Sistema</h1>
            <p className="text-muted-foreground text-sm uppercase font-display tracking-wider">
              Uma falha crítica ocorreu na interface da arena.
            </p>
            {this.state.error && (
              <div className="bg-card p-3 rounded border border-border text-left mt-4 overflow-auto max-h-32">
                <code className="text-[10px] text-red-400">{this.state.error.message}</code>
              </div>
            )}
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-black font-display font-bold tracking-widest"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> REINICIAR ARENA
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
