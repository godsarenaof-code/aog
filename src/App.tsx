import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
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
import TeamBuilder from "./pages/TeamBuilder.tsx";
import Lore from "./pages/Lore.tsx";
import Placeholder from "./pages/Placeholder.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/match" element={<Match />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/champions" element={<Champions />} />
            <Route path="/items" element={<Items />} />
            <Route path="/simulator" element={<TeamBuilder />} />
            <Route path="/lore" element={<Lore />} />
            <Route path="/patch-notes" element={<PatchNotes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ranked" element={<Placeholder title="RANKED" desc="Sistema de ranking competitivo sazonal — em construção. Suba do Aço ao Divino." />} />
            <Route path="/clans" element={<Placeholder title="CLÃS" desc="Forme alianças, dispute torneios em equipe e domine o leaderboard global." />} />
            <Route path="/roadmap" element={<Placeholder title="ROADMAP" desc="Confira as próximas atualizações, eventos e features planejadas para o A.O.G." />} />
            <Route path="/patch-notes-old" element={<Placeholder title="PATCH NOTES" desc="Histórico completo de alterações." />} />
            <Route path="/settings" element={<Placeholder title="AJUSTES" desc="Configurações de conta, áudio, vídeo e gameplay." />} />
            <Route path="/arena-portal-gestao" element={<AdminPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
