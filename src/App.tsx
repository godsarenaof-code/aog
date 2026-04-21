import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import Lobby from "./pages/Lobby.tsx";
import Match from "./pages/Match.tsx";
import Collection from "./pages/Collection.tsx";
import Profile from "./pages/Profile.tsx";
import Placeholder from "./pages/Placeholder.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/match" element={<Match />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ranked" element={<Placeholder title="RANKED" desc="Sistema de ranking competitivo sazonal — em construção. Suba do Aço ao Divino." />} />
          <Route path="/clans" element={<Placeholder title="CLÃS" desc="Forme alianças, dispute torneios em equipe e domine o leaderboard global." />} />
          <Route path="/roadmap" element={<Placeholder title="ROADMAP" desc="Confira as próximas atualizações, eventos e features planejadas para o A.O.G." />} />
          <Route path="/settings" element={<Placeholder title="AJUSTES" desc="Configurações de conta, áudio, vídeo e gameplay." />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
