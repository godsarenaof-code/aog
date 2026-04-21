import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import Lobby from "./pages/Lobby.tsx";
import Match from "./pages/Match.tsx";
import Collection from "./pages/Collection.tsx";
import Champions from "./pages/Champions.tsx";
import Items from "./pages/Items.tsx";
import PatchNotes from "./pages/PatchNotes.tsx";
import Profile from "./pages/Profile.tsx";
import AdminPortal from "./pages/AdminPortal.tsx";
import Lore from "./pages/Lore.tsx";
import Ranked from "./pages/Ranked.tsx";
import Placeholder from "./pages/Placeholder.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-display tracking-[0.5em] text-muted-foreground animate-pulse">
        VALIDANDO CREDENCIAIS...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/lore" element={<Lore />} />
            <Route path="/patch-notes" element={<PatchNotes />} />
              {/* Private Routes */}
              <Route path="/lobby" element={<ProtectedRoute><Lobby /></ProtectedRoute>} />
              <Route path="/match" element={<ProtectedRoute><Match /></ProtectedRoute>} />
              <Route path="/collection" element={<ProtectedRoute><Collection /></ProtectedRoute>} />
              <Route path="/champions" element={<Champions />} />
              <Route path="/items" element={<Items />} />
              <Route path="/simulator" element={<TeamBuilder />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
              
              <Route path="/ranked" element={<ProtectedRoute><Ranked /></ProtectedRoute>} />
              <Route path="/clans" element={<ProtectedRoute><Placeholder title="CLÃS" desc="Forme alianças." /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Placeholder title="AJUSTES" desc="Configurações." /></ProtectedRoute>} />
              
              <Route path="/arena-portal-gestao" element={<ProtectedRoute><AdminPortal /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
