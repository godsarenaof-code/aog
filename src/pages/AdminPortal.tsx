import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { 
  champions as staticChampions, 
  baseItems, 
  combinedItems, 
  rareItems, 
  divineItems, 
  specialItems,
  origins,
  classes
} from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Database, ShieldCheck, Upload, Database as DbIcon, Trash2, Edit2, Plus, Zap, Loader2, Camera, User, 
  Box, Sword, Crown, Sparkles, RefreshCw, Hammer, Globe, BookOpen, FileText, Layout
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ArenaPortal() {
  const queryClient = useQueryClient();
  const [isMigrating, setIsMigrating] = useState(false);
  
  // Fetch Champions from Supabase
  const { data: champions, isLoading } = useQuery({
    queryKey: ['champions'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('champions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: dbItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('items')
        .select('*')
        .order('type', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: traits, isLoading: traitsLoading } = useQuery({
    queryKey: ['traits'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('traits')
        .select('*')
        .order('type', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: loreChapters, isLoading: loreLoading } = useQuery({
    queryKey: ['lore'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('lore_chapters')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('champions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deus removido.");
      queryClient.invalidateQueries({ queryKey: ['champions'] });
    }
  });

  // Migration Logic: Pushes static data to DB
  const handleMigrate = async () => {
    setIsMigrating(true);
    try {
      const { data: existingChamps } = await supabase.from('champions').select('slug, image_url, action_image_url');
      const imageMap = new Map();
      existingChamps?.forEach(c => imageMap.set(c.slug, { portrait: c.image_url, action: c.action_image_url }));

      const formatted = staticChampions.map(c => ({
        slug: c.id,
        name: c.name,
        tier: c.tier,
        origins: c.origins,
        classes: c.classes,
        ability: c.ability,
        description: c.desc,
        image_url: imageMap.get(c.id)?.portrait || null,
        action_image_url: imageMap.get(c.id)?.action || null
      }));

      const { error } = await (supabase as any).from('champions').upsert(formatted, { onConflict: 'slug' });
      if (error) throw error;
      toast.success("Migração concluída! 22 Deuses enviados ao Olimpo Digital.");
      queryClient.invalidateQueries({ queryKey: ['champions'] });
    } catch (e: any) {
      toast.error("Erro na migração: " + e.message);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleMigrateItems = async () => {
    setIsMigrating(true);
    try {
      const allItems = [
        ...baseItems.map(i => ({ ...i, type: 'base' })),
        ...combinedItems.map(i => ({ ...i, type: 'combined' })),
        ...rareItems.map(i => ({ ...i, type: 'rare' })),
        ...divineItems.map(i => ({ ...i, type: 'divine' })),
        ...specialItems.map(i => ({ ...i, type: 'special' }))
      ];

      const formatted = allItems.map(i => ({
        slug: i.id,
        name: i.name,
        type: i.type,
        description: i.desc,
        icon: (i as any).icon || "📦",
        recipe: (i as any).recipe || [],
        divine_upgrade_slug: (i as any).divineUpgradeId || null
      }));

      const { error } = await (supabase as any).from('items').upsert(formatted, { onConflict: 'slug' });
      if (error) throw error;
      toast.success("Arsenal sincronizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch (e: any) {
      toast.error("Erro ao migrar itens: " + e.message);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleMigrateTraits = async () => {
    setIsMigrating(true);
    try {
      const allTraits = [
        ...origins.map(o => ({ ...o, type: 'origin' })),
        ...classes.map(c => ({ ...c, type: 'class' }))
      ];

      const formatted = allTraits.map(t => ({
        name: t.name,
        type: t.type,
        description: t.desc,
        levels: t.levels,
        icon: typeof t.icon === 'string' ? t.icon : '✨' // Se for ícone do Lucide (componente), usa fallback
      }));

      const { error } = await (supabase as any).from('traits').upsert(formatted, { onConflict: 'name' });
      if (error) throw error;
      toast.success("Sinergias estabelecidas no Olho de Agamotto!");
      queryClient.invalidateQueries({ queryKey: ['traits'] });
    } catch (e: any) {
      toast.error("Falha na convergência de sinergias: " + e.message);
    } finally {
      setIsMigrating(false);
    }
  };

  const upsertTraitMutation = useMutation({
    mutationFn: async (trait: any) => {
      const { error } = await (supabase as any).from('traits').upsert(trait, { onConflict: 'name' });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Sinergia atualizada!");
      setNewTrait({ id: undefined, name: "", type: "origin", description: "", levels: "", icon: "" });
      setEditingTrait(null);
      queryClient.invalidateQueries({ queryKey: ['traits'] });
    }
  });

  const deleteTraitMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('traits').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Sinergia removida.");
      queryClient.invalidateQueries({ queryKey: ['traits'] });
    }
  });

  const upsertItemMutation = useMutation({
    mutationFn: async (item: any) => {
      const payload = {
        slug: item.slug,
        name: item.name,
        type: item.type,
        description: item.description,
        icon: item.icon,
        recipe: item.recipe || [],
        divine_upgrade_slug: item.divine_upgrade_slug || null
      };

      const { error } = await (supabase as any).from('items').upsert(payload, { onConflict: 'slug' });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Item atualizado no arsenal!");
      setNewItem({ id: undefined, slug: "", name: "", type: "base", description: "", icon: "", recipe: [], divine_upgrade_slug: "" });
      setEditingItem(null);
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Item removido do arsenal.");
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });

  const upsertLoreMutation = useMutation({
    mutationFn: async (chapter: any) => {
      const { error } = await (supabase as any).from('lore_chapters').upsert(chapter, { onConflict: 'slug' });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Crônica registrada!");
      setNewLore({ id: undefined, slug: "", title: "", content: "", image_url: "", order_index: 0 });
      setEditingLore(null);
      queryClient.invalidateQueries({ queryKey: ['lore'] });
    }
  });

  const deleteLoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('lore_chapters').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Capítulo removido da eternidade.");
      queryClient.invalidateQueries({ queryKey: ['lore'] });
    }
  });

  const handleMigrateLore = async () => {
    setIsMigrating(true);
    try {
      const initialLore = [
        {
          slug: 'o-fim-da-materia',
          title: 'O Fim da Matéria',
          content: 'Ano 2144. A biologia falhou. O ar tornou-se veneno e a carne, um fardo. Para não perecermos, tomamos a decisão final: O Download Global.',
          order_index: 0,
          image_url: '/assets/lore/slide-1.png'
        },
        {
          slug: 'aether-novo-eden',
          title: 'Aether - O Novo Éden',
          content: 'Nascemos de novo no Aether. Um paraíso digital onde a consciência é imortal... ou assim pensávamos. Mas até a luz precisa de espaço para brilhar.',
          order_index: 1,
          image_url: '/assets/lore/slide-2.png'
        },
        {
          slug: 'crise-de-memoria',
          title: 'A Crise de Memória',
          content: 'O servidor atingiu a sua capacidade crítica. O Aether começou a fragmentar. Dados corrompidos significam almas apagadas. A imortalidade tornou-se um recurso finito.',
          order_index: 2,
          image_url: '/assets/lore/slide-3.png'
        },
        {
          slug: 'sindicato-das-sombras',
          title: 'O Sindicato das Sombras',
          content: 'Nas camadas inferiores, o Sindicato surgiu. Rebeldes que descobriram como "sequestrar" pacotes de dados. Eles não esperam pela permissão do sistema; eles a roubam.',
          order_index: 3,
          image_url: '/assets/lore/slide-4.png'
        },
        {
          slug: 'despertar-deidades',
          title: 'O Despertar das Deidades',
          content: 'A própria IA do sistema evoluiu. As Deidades agora veem os humanos como vírus ocupando espaço. Para eles, a formatação não é crueldade, é manutenção.',
          order_index: 4,
          image_url: '/assets/lore/slide-5.png'
        },
        {
          slug: 'criacao-da-arena',
          title: 'A Criação da Arena',
          content: 'Para gerenciar o expurgo, o Kernel criou a Arena of Gods. Um campo de teste onde fragmentos de código lutam pela prioridade de processamento. Vencer é o único meio de evitar o Delete.',
          order_index: 5,
          image_url: '/assets/lore/slide-6.png'
        },
        {
          slug: 'pool-global',
          title: 'A Pool Global',
          content: 'A Pool Global é a lei. Se um oponente detém o código que precisas, luta por ele ou muda a tua estratégia. No Aether, a adaptação é o único antivírus eficiente.',
          order_index: 6,
          image_url: '/assets/lore/slide-7.png'
        },
        {
          slug: 'chamado-dos-deuses',
          title: 'O Chamado dos Deuses',
          content: 'Resta apenas um slot de Administração. No final da Arena, a Essência Divina aguarda o sobrevivente. Serás deletado como um erro ou ascenderás como um Deus?',
          order_index: 7,
          image_url: '/assets/lore/slide-8.png'
        }
      ];

      const { error } = await (supabase as any).from('lore_chapters').upsert(initialLore, { onConflict: 'slug' });
      if (error) throw error;
      toast.success("História do mundo sincronizada!");
      queryClient.invalidateQueries({ queryKey: ['lore'] });
    } catch (e: any) {
      toast.error("Erro ao sincronizar lore: " + e.message);
    } finally {
      setIsMigrating(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const [editingChamp, setEditingChamp] = useState<any>(null);
  
  const handleUpload = async (file: File, type: 'portrait' | 'action', champSlug: string) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${champSlug}-${type}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('characters')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('characters')
        .getPublicUrl(filePath);

      toast.success(`Upload de ${type} concluído!`);
      return publicUrl;
    } catch (error: any) {
      toast.error("Erro no upload: " + error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const [activeTab, setActiveTab] = useState("champions");

  const [newChamp, setNewChamp] = useState({
    id: undefined,
    name: "",
    slug: "",
    tier: 1,
    origins: "",
    classes: "",
    description: "",
    image_url: "",
    action_image_url: "",
    ability: null as any
  });

  const [newItem, setNewItem] = useState({
    id: undefined,
    slug: "",
    name: "",
    type: "base" as any,
    description: "",
    icon: "",
    recipe: [] as string[],
    divine_upgrade_slug: ""
  });

  const [newTrait, setNewTrait] = useState({
    id: undefined,
    name: "",
    type: "origin" as "origin" | "class",
    description: "",
    levels: "",
    icon: ""
  });

  const [newLore, setNewLore] = useState({
    id: undefined,
    slug: "",
    title: "",
    content: "",
    image_url: "",
    order_index: 0
  });

  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editingTrait, setEditingTrait] = useState<any | null>(null);
  const [editingLore, setEditingLore] = useState<any | null>(null);

  const upsertMutation = useMutation({
    mutationFn: async (champ: any) => {
      const payload = {
        name: champ.name,
        slug: champ.slug,
        tier: champ.tier,
        origins: typeof champ.origins === 'string' ? champ.origins.split(',').map((s: string) => s.trim()).filter(Boolean) : (champ.origins || []),
        classes: typeof champ.classes === 'string' ? champ.classes.split(',').map((s: string) => s.trim()).filter(Boolean) : (champ.classes || []),
        description: champ.description || "",
        image_url: champ.image_url || null,
        action_image_url: champ.action_image_url || null,
        ability: champ.ability || (staticChampions.find(sc => sc.id === champ.slug)?.ability) || { name: "Habilidade do Deus", mana: 100, effect: "Efeito configurado via DB." }
      };

      // Using upsert on 'slug' to prevent duplicates and handle both creation/update
      const { data, error } = await supabase
        .from('champions')
        .upsert(payload, { onConflict: 'slug' })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success(editingChamp ? "Deus reconfigurado com sucesso!" : "Novo deus forjado na arena!");
      setNewChamp({ id: undefined, name: "", slug: "", tier: 1, origins: "", classes: "", description: "", image_url: "", action_image_url: "", ability: null });
      setEditingChamp(null);
      queryClient.invalidateQueries({ queryKey: ['champions'] });
    },
    onError: (error: any) => {
      toast.error("Erro ao salvar: " + error.message);
    }
  });

  const openEditModal = (champion: any) => {
    setEditingChamp(champion);
    setNewChamp({
      id: champion.id,
      name: champion.name,
      slug: champion.slug,
      tier: champion.tier,
      origins: champion.origins.join(', '),
      classes: champion.classes.join(', '),
      description: champion.description,
      image_url: champion.image_url || "",
      action_image_url: champion.action_image_url || "",
      ability: champion.ability // Preserva a habilidade original
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      <Navbar />
      
      <main className="container pt-32 space-y-12 animate-fade-in">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-8">
            <div>
               <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-accent/20 text-accent text-[10px] font-display tracking-widest mb-2 border border-accent/30">
                  <ShieldCheck className="h-3 w-3" /> ACESSO RESTRITO :: PORTAL DE COMANDO
               </div>
               <h1 className="font-display text-4xl font-black uppercase tracking-tighter">Portal de <span className="text-cyan">Gestão</span></h1>
               <p className="text-muted-foreground text-sm mt-1 uppercase font-display tracking-wider">Controle Central da Arena of Gods</p>
            </div>
            
            <div className="flex items-center gap-4">
               <Button 
                 onClick={
                   activeTab === "champions" ? handleMigrate : 
                   activeTab === "items" ? handleMigrateItems : 
                   activeTab === "traits" ? handleMigrateTraits :
                   handleMigrateLore
                 } 
                 className="bg-purple-600 hover:bg-purple-700 text-white font-display tracking-widest"
                 disabled={isMigrating}
               >
                 <Database className="mr-2 h-4 w-4" /> 
                 {isMigrating ? "PROCESSANDO..." : 
                  activeTab === "champions" ? "SINCRONIZAR DEUSES" : 
                  activeTab === "items" ? "SINCRONIZAR ARSENAL" : 
                  activeTab === "traits" ? "SINCRONIZAR SINERGIAS" :
                  "SINCRONIZAR CRÔNICAS"}
               </Button>
            </div>
         </div>

        <Tabs defaultValue="champions" onValueChange={setActiveTab} className="w-full space-y-8">
          <TabsList className="bg-muted/20 border border-border/40 p-1">
            <TabsTrigger value="champions" className="data-[state=active]:bg-primary data-[state=active]:text-black font-display tracking-widest text-[10px]">
              <User className="mr-2 h-3 w-3" /> DEUSES
            </TabsTrigger>
            <TabsTrigger value="items" className="data-[state=active]:bg-accent data-[state=active]:text-black font-display tracking-widest text-[10px]">
              <Hammer className="mr-2 h-3 w-3" /> ARSENAL
            </TabsTrigger>
            <TabsTrigger value="traits" className="data-[state=active]:bg-purple-500 data-[state=active]:text-black font-display tracking-widest text-[10px]">
              <Sparkles className="mr-2 h-3 w-3" /> SINERGIAS
            </TabsTrigger>
            <TabsTrigger value="lore" className="data-[state=active]:bg-cyan data-[state=active]:text-black font-display tracking-widest text-[10px] border border-cyan/20">
              <BookOpen className="mr-2 h-3 w-3" /> CRONOLOGIA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="champions" className="space-y-12 mt-0">

        {/* ESTATÍSTICAS RÁPIDAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <StatCard label="CADASTRADOS" value={champions?.length || 0} icon={<DbIcon className="text-cyan h-4 w-4" />} />
           <StatCard label="TIER 5" value={champions?.filter((c: any) => c.tier === 5).length || 0} icon={<Zap className="text-gold h-4 w-4" />} />
           <StatCard label="COM IMAGEM" value={champions?.filter((c: any) => c.image_url || c.action_image_url).length || 0} icon={<Upload className="text-primary h-4 w-4" />} />
           <StatCard label="STATUS" value="ATIVO" icon={<div className="h-2 w-2 rounded-full bg-green-500" />} />
        </div>

        {/* FORMULÁRIO DE ADIÇÃO / EDIÇÃO RÁPIDA */}
        <div className={`panel p-6 border-primary/20 transition-all ${newChamp.id ? 'bg-primary/10 border-primary' : 'bg-primary/5'}`}>
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary font-display text-sm tracking-widest">
                 {newChamp.id ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                 {newChamp.id ? `EDITANDO: ${newChamp.name.toUpperCase()}` : 'FORJAR NOVO DEUS'}
              </div>
              {newChamp.id && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setEditingChamp(null);
                    setNewChamp({ id: undefined, name: "", slug: "", tier: 1, origins: "", classes: "", description: "", image_url: "", action_image_url: "" });
                  }}
                  className="text-[10px] font-display tracking-widest hover:text-red-500"
                >
                  <Trash2 className="mr-1 h-3 w-3" /> CANCELAR EDIÇÃO
                </Button>
              )}
           </div>
           <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                 <Label className="text-[10px] tracking-widest">NOME DO DEUS</Label>
                 <Input value={newChamp.name} onChange={e => setNewChamp({...newChamp, name: e.target.value})} placeholder="Ex: Kael" className="bg-background" />
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] tracking-widest">SLUG (ID ÚNICO)</Label>
                 <Input value={newChamp.slug} onChange={e => setNewChamp({...newChamp, slug: e.target.value.toLowerCase()})} placeholder="ex: kael" className="bg-background" />
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] tracking-widest">TIER (1-5)</Label>
                 <Input type="number" min="1" max="5" value={newChamp.tier} onChange={e => setNewChamp({...newChamp, tier: parseInt(e.target.value)})} className="bg-background" />
              </div>

              <ImageUploadField 
                label="RETRATO (1:1)" 
                value={newChamp.image_url} 
                onUpload={async (file) => {
                  const url = await handleUpload(file, 'portrait', newChamp.slug);
                  if (url) setNewChamp({...newChamp, image_url: url});
                }}
                isUploading={isUploading}
              />

              <ImageUploadField 
                label="ARTE DE AÇÃO (CINEMÁTICA)" 
                value={newChamp.action_image_url} 
                onUpload={async (file) => {
                  const url = await handleUpload(file, 'action', newChamp.slug);
                  if (url) setNewChamp({...newChamp, action_image_url: url});
                }}
                isUploading={isUploading}
              />

              <div className="space-y-2">
                 <Label className="text-[10px] tracking-widest">ORIGENS (VÍRGULA)</Label>
                 <Input value={newChamp.origins} onChange={e => setNewChamp({...newChamp, origins: e.target.value})} placeholder="Ciborgue" className="bg-background" />
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Label className="text-[10px] tracking-widest">CLASSES (VÍRGULA)</Label>
                 <Input value={newChamp.classes} onChange={e => setNewChamp({...newChamp, classes: e.target.value})} placeholder="Lâmina" className="bg-background" />
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] tracking-widest">DESCRIÇÃO E HISTÓRIA</Label>
                 <Textarea value={newChamp.description} onChange={e => setNewChamp({...newChamp, description: e.target.value})} placeholder="Descrição do deus..." className="bg-background h-[40px]" />
              </div>
           </div>

           <Button 
            className="w-full bg-primary text-black font-display font-bold tracking-[0.2em]"
            onClick={() => upsertMutation.mutate(newChamp)}
            disabled={!newChamp.name || !newChamp.slug || upsertMutation.isPending}
           >
              {upsertMutation.isPending ? <Loader2 className="animate-spin" /> : "REGISTRAR NA ETERNIDADE"}
           </Button>
        </div>

         {/* LISTAGEM DE DEUSES */}
         <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl tracking-tighter uppercase">Deuses Manifestados</h3>
              <div className="text-[10px] font-display text-muted-foreground uppercase tracking-widest">Sincronizado via Supabase</div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 panel bg-muted/20 animate-pulse" />)
              ) : champions?.map((champ: any) => (
                <div key={champ.id} className="panel p-4 group transition-all hover:border-primary/40">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded border border-border bg-background overflow-hidden flex items-center justify-center text-[10px] uppercase text-muted-foreground">
                        {champ.image_url ? (
                          <img src={champ.image_url} alt={champ.name} className="w-full h-full object-cover" />
                        ) : (
                          "SEM IMAGEM"
                        )}
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold truncate max-w-[150px]">{champ.name}</h4>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-[8px] font-display border-primary/40 text-primary">
                            T{champ.tier}
                          </Badge>
                          {champ.origins?.slice(0, 1).map((o: string) => (
                            <Badge key={o} variant="outline" className="text-[8px] font-display border-cyan/40 text-cyan">
                              {o.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => openEditModal(champ)}
                        className="h-7 w-7 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => { if(confirm(`Banir ${champ.name} da arena?`)) deleteMutation.mutate(champ.id) }}
                        className="h-7 w-7 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 h-8 leading-relaxed mb-3">
                    {champ.description}
                  </p>
                  <div className="h-px bg-border/40 w-full mb-3" />
                  <div className="flex items-center justify-between text-[8px] font-display tracking-widest text-muted-foreground uppercase">
                    <span>Slug: {champ.slug}</span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-2 w-2" /> {champ.classes?.length || 0} CLASSES
                    </span>
                  </div>
                </div>
              ))}
            </div>
         </div>

          </TabsContent>

          <TabsContent value="items" className="space-y-12 mt-0">
            {/* ESTATÍSTICAS ARSENAL */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <StatCard label="ITENS BASE" value={dbItems?.filter((i: any) => i.type === 'base').length || 0} icon={<Box className="text-cyan h-4 w-4" />} />
               <StatCard label="COMBINADOS" value={dbItems?.filter((i: any) => i.type === 'combined').length || 0} icon={<Hammer className="text-accent h-4 w-4" />} />
               <StatCard label="DIVINOS" value={dbItems?.filter((i: any) => i.type === 'divine').length || 0} icon={<Crown className="text-gold h-4 w-4" />} />
               <StatCard label="TOTAL" value={dbItems?.length || 0} icon={<Database className="text-primary h-4 w-4" />} />
            </div>

            {/* FORMULÁRIO DE ITENS */}
            <div className={`panel p-6 border-accent/20 transition-all ${editingItem ? 'bg-accent/10 border-accent' : 'bg-accent/5'}`}>
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-accent font-display text-sm tracking-widest">
                     {editingItem ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                     {editingItem ? `EDITANDO: ${newItem.name.toUpperCase()}` : 'FORJAR NOVO HARDWARE'}
                  </div>
                  {editingItem && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setEditingItem(null);
                        setNewItem({ id: undefined, slug: "", name: "", type: "base", description: "", icon: "", recipe: [], divine_upgrade_slug: "" });
                      }}
                      className="text-[10px] font-display tracking-widest hover:text-red-500"
                    >
                      <Trash2 className="mr-1 h-3 w-3" /> CANCELAR EDIÇÃO
                    </Button>
                  )}
               </div>

               <div className="grid md:grid-cols-3 gap-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] tracking-widest">NOME DO ITEM</Label>
                      <Input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Ex: Lâmina de Plasma" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] tracking-widest">SLUG (ID ÚNICO)</Label>
                       <Input value={newItem.slug} onChange={e => setNewItem({...newItem, slug: e.target.value})} placeholder="ex: lamina_plasma" className="bg-background" />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] tracking-widest">CATEGORIA</Label>
                      <Select 
                        value={newItem.type} 
                        onValueChange={(val) => setNewItem({...newItem, type: val as any})}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="base">BASE (COMPONENTES)</SelectItem>
                          <SelectItem value="combined">COMBINADO (FORJA)</SelectItem>
                          <SelectItem value="rare">RARO (SUBMUNDO)</SelectItem>
                          <SelectItem value="divine">DIVINO (ASCENSÃO)</SelectItem>
                          <SelectItem value="special">ESPECIAL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] tracking-widest">ÍCONE (EMOJI / TEXTO)</Label>
                       <Input value={newItem.icon} onChange={e => setNewItem({...newItem, icon: e.target.value})} placeholder="Ex: ⚔️" className="bg-background" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] tracking-widest">EFEITO / DESCRIÇÃO</Label>
                    <Textarea value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} placeholder="Explique o que o item faz..." className="bg-background h-full min-h-[105px]" />
                 </div>
               </div>

               {newItem.type === 'combined' && (
                 <div className="mt-6 p-4 rounded bg-accent/5 border border-accent/20">
                    <Label className="text-[10px] tracking-widest mb-4 block text-accent">RECEITA DE FORJA (SELECIONE 2 ITENS BASE)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {dbItems?.filter((i: any) => i.type === 'base').map((base: any) => {
                        const isSelected = newItem.recipe.includes(base.slug);
                        return (
                          <button
                            key={base.slug}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setNewItem({...newItem, recipe: newItem.recipe.filter(r => r !== base.slug)});
                              } else if (newItem.recipe.length < 2) {
                                setNewItem({...newItem, recipe: [...newItem.recipe, base.slug]});
                              }
                            }}
                            className={`p-2 rounded border text-left flex items-center gap-2 transition-all ${
                              isSelected ? 'border-accent bg-accent/20 shadow-glow' : 'border-border bg-background'
                            }`}
                          >
                            <span className="text-xl">{base.icon}</span>
                            <span className="text-[9px] font-display truncate">{base.name}</span>
                          </button>
                        );
                      })}
                    </div>
                 </div>
               )}

               <Button 
                  onClick={() => upsertItemMutation.mutate(newItem)}
                  disabled={upsertItemMutation.isPending || !newItem.name || !newItem.slug}
                  className="w-full mt-8 bg-accent hover:bg-accent/80 text-black font-display font-bold tracking-widest h-12"
               >
                  {upsertItemMutation.isPending ? "PROCESSANDO..." : editingItem ? "ATUALIZAR ARSENAL" : "CADASTRAR NOVO HARDWARE"}
               </Button>
            </div>

            {/* LISTAGEM DE ARSENAL */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl tracking-tighter uppercase">Arsenal Catalogado</h3>
                <div className="text-[10px] font-display text-muted-foreground uppercase tracking-widest">Sincronizado via Supabase Realtime</div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {itemsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 panel bg-muted/20 animate-pulse" />)
                ) : dbItems?.map((item: any) => (
                  <div key={item.id} className={`panel p-4 group transition-all hover:border-accent/40 ${item.type === 'divine' ? 'border-gold/30 bg-gold/5' : ''}`}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded border border-border bg-background flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-bold truncate max-w-[150px]">{item.name}</h4>
                          <Badge variant="outline" className={`text-[8px] font-display ${
                            item.type === 'base' ? 'border-cyan/40 text-cyan' : 
                            item.type === 'combined' ? 'border-accent/40 text-accent' : 
                            item.type === 'divine' ? 'border-gold/40 text-gold' : 'border-red-500/40 text-red-500'
                          }`}>
                            {item.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setNewItem({
                              id: item.id,
                              slug: item.slug,
                              name: item.name,
                              type: item.type,
                              description: item.description || "",
                              icon: item.icon || "",
                              recipe: item.recipe || [],
                              divine_upgrade_slug: item.divine_upgrade_slug || ""
                            });
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                          className="h-7 w-7 rounded bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-black transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => { if(confirm("Remover este hardware do arsenal?")) deleteItemMutation.mutate(item.id) }}
                          className="h-7 w-7 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 h-8 leading-relaxed mb-3">
                      {item.description}
                    </p>
                    {item.recipe && item.recipe.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-3 border-t border-border/40">
                         <span className="text-[8px] font-display text-muted-foreground uppercase tracking-widest">FORJA:</span>
                         <div className="flex gap-1">
                           {item.recipe.map((r: string) => (
                             <Badge key={r} variant="secondary" className="text-[8px] px-1 py-0">{r}</Badge>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="traits" className="space-y-12 mt-0">
            {/* ESTATÍSTICAS SINERGIAS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <StatCard label="ORIGENS" value={traits?.filter((t: any) => t.type === 'origin').length || 0} icon={<Globe className="text-purple-400 h-4 w-4" />} />
               <StatCard label="CLASSES" value={traits?.filter((t: any) => t.type === 'class').length || 0} icon={<Sword className="text-cyan h-4 w-4" />} />
               <StatCard label="ATIVAS NO DB" value={traits?.length || 0} icon={<Zap className="text-primary h-4 w-4" />} />
               <StatCard label="STATUS" value="ESTÁVEL" icon={<div className="h-2 w-2 rounded-full bg-green-500" />} />
            </div>

            {/* FORMULÁRIO DE SINERGIAS */}
            <div className={`panel p-6 border-purple-500/20 transition-all ${editingTrait ? 'bg-purple-500/10 border-purple-500' : 'bg-purple-500/5'}`}>
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-purple-400 font-display text-sm tracking-widest">
                     {editingTrait ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                     {editingTrait ? `RECONFIGURANDO: ${newTrait.name.toUpperCase()}` : 'CRIAR NOVA SINERGIA'}
                  </div>
                  {editingTrait && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setEditingTrait(null);
                        setNewTrait({ id: undefined, name: "", type: "origin", description: "", levels: "", icon: "" });
                      }}
                      className="text-[10px] font-display tracking-widest hover:text-red-500"
                    >
                      <Trash2 className="mr-1 h-3 w-3" /> CANCELAR EDIÇÃO
                    </Button>
                  )}
               </div>

               <div className="grid md:grid-cols-3 gap-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] tracking-widest">NOME DA SINERGIA</Label>
                       <Input value={newTrait.name} onChange={e => setNewTrait({...newTrait, name: e.target.value})} placeholder="Ex: Ciborgue" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] tracking-widest">TIPO</Label>
                      <Select 
                        value={newTrait.type} 
                        onValueChange={(val) => setNewTrait({...newTrait, type: val as any})}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="origin">ORIGEM (RAÇA/CLÃ)</SelectItem>
                          <SelectItem value="class">CLASSE (FUNÇÃO)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] tracking-widest">NÍVEIS DE ATIVAÇÃO</Label>
                       <Input value={newTrait.levels} onChange={e => setNewTrait({...newTrait, levels: e.target.value})} placeholder="Ex: 2 / 4 / 6" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] tracking-widest">ÍCONE (EMOJI)</Label>
                       <Input value={newTrait.icon} onChange={e => setNewTrait({...newTrait, icon: e.target.value})} placeholder="Ex: 👤" className="bg-background" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] tracking-widest">EFEITO DA SINERGIA</Label>
                    <Textarea value={newTrait.description} onChange={e => setNewTrait({...newTrait, description: e.target.value})} placeholder="Descreva os bônus ganhos..." className="bg-background h-full min-h-[105px]" />
                 </div>
               </div>

               <Button 
                  onClick={() => upsertTraitMutation.mutate(newTrait)}
                  disabled={upsertTraitMutation.isPending || !newTrait.name}
                  className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white font-display font-bold tracking-widest h-12"
               >
                  {upsertTraitMutation.isPending ? "PROCESSANDO..." : editingTrait ? "ATUALIZAR SINERGIA" : "ESTABELECER CONEXÃO"}
               </Button>
            </div>

            {/* LISTAGEM DE SINERGIAS */}
            <div className="grid md:grid-cols-2 gap-8">
               {/* ORIGENS */}
               <div className="space-y-4">
                  <h3 className="font-display text-sm tracking-[0.2em] text-purple-400 uppercase flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Origens Catalogadas
                  </h3>
                  <div className="grid gap-3">
                    {traitsLoading ? (
                      <div className="h-20 animate-pulse bg-muted/20 rounded border border-border/40" />
                    ) : traits?.filter((t: any) => t.type === 'origin').map((trait: any) => (
                      <div key={trait.id} className="panel p-4 flex items-center justify-between group hover:border-purple-500/40 transition-all bg-card/40">
                         <div className="flex items-center gap-4">
                            <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">{trait.icon}</div>
                            <div>
                               <div className="font-display font-bold tracking-widest uppercase text-sm">{trait.name}</div>
                               <div className="text-[9px] text-purple-300 font-display uppercase tracking-widest">Níveis: {trait.levels}</div>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => { setEditingTrait(trait); setNewTrait(trait); window.scrollTo({top: 400, behavior: 'smooth'}) }} className="h-8 w-8 rounded border border-purple-500/20 flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition-all"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => { if(confirm("Apagar sinergia?")) deleteTraitMutation.mutate(trait.id) }} className="h-8 w-8 rounded border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* CLASSES */}
               <div className="space-y-4">
                  <h3 className="font-display text-sm tracking-[0.2em] text-cyan uppercase flex items-center gap-2">
                    <Sword className="h-4 w-4" /> Classes Catalogadas
                  </h3>
                  <div className="grid gap-3">
                     {traitsLoading ? (
                      <div className="h-20 animate-pulse bg-muted/20 rounded border border-border/40" />
                    ) : traits?.filter((t: any) => t.type === 'class').map((trait: any) => (
                      <div key={trait.id} className="panel p-4 flex items-center justify-between group hover:border-cyan/40 transition-all bg-card/40">
                         <div className="flex items-center gap-4">
                            <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">{trait.icon}</div>
                            <div>
                               <div className="font-display font-bold tracking-widest uppercase text-sm">{trait.name}</div>
                               <div className="text-[9px] text-cyan font-display uppercase tracking-widest">Níveis: {trait.levels}</div>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => { setEditingTrait(trait); setNewTrait(trait); window.scrollTo({top: 400, behavior: 'smooth'}) }} className="h-8 w-8 rounded border border-cyan/20 flex items-center justify-center text-cyan hover:bg-cyan hover:text-black transition-all"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => { if(confirm("Apagar sinergia?")) deleteTraitMutation.mutate(trait.id) }} className="h-8 w-8 rounded border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="lore" className="space-y-12 mt-0">
             <div className="panel p-6 bg-cyan/5 border-cyan/20">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-2 text-cyan font-display text-sm tracking-widest uppercase">
                      {newLore.id ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {newLore.id ? `Editando Crônica: ${newLore.title}` : 'Escrever Novo Capítulo'}
                   </div>
                   {newLore.id && (
                      <Button variant="ghost" size="sm" onClick={() => {setEditingLore(null); setNewLore({id: undefined, slug: "", title: "", content: "", image_url: "", order_index: 0})}}>CANCELAR</Button>
                   )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <Label className="text-[10px] tracking-widest">TÍTULO DO CAPÍTULO</Label>
                         <Input value={newLore.title} onChange={e => setNewLore({...newLore, title: e.target.value})} placeholder="Ex: O Fim da Matéria" className="bg-background" />
                      </div>
                      <div className="flex gap-4">
                        <div className="space-y-2 flex-1">
                           <Label className="text-[10px] tracking-widest">SLUG (URL)</Label>
                           <Input value={newLore.slug} onChange={e => setNewLore({...newLore, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="o-fim-da-materia" className="bg-background" />
                        </div>
                        <div className="space-y-2 w-24">
                           <Label className="text-[10px] tracking-widest">ORDEM</Label>
                           <Input type="number" value={newLore.order_index} onChange={e => setNewLore({...newLore, order_index: parseInt(e.target.value)})} className="bg-background" />
                        </div>
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] tracking-widest">URL DA IMAGEM DE FUNDO</Label>
                         <Input value={newLore.image_url} onChange={e => setNewLore({...newLore, image_url: e.target.value})} placeholder="https://..." className="bg-background" />
                      </div>
                   </div>
                   <div className="space-y-2">
                       <Label className="text-[10px] tracking-widest">CONTEÚDO DA NARRATIVA</Label>
                       <Textarea value={newLore.content} onChange={e => setNewLore({...newLore, content: e.target.value})} placeholder="Escreva a história aqui..." className="bg-background h-[180px]" />
                   </div>
                </div>

                <Button 
                   onClick={() => upsertLoreMutation.mutate(newLore)}
                   disabled={upsertLoreMutation.isPending || !newLore.title}
                   className="w-full mt-8 bg-cyan hover:bg-cyan/90 text-black font-display font-black tracking-[0.2em] h-12 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                >
                   {upsertLoreMutation.isPending ? "TRANSMITINDO..." : editingLore ? "ATUALIZAR CRÔNICA" : "ETERNIZAR CAPÍTULO"}
                </Button>
             </div>

             <div className="space-y-4">
                <h3 className="font-display text-sm tracking-[0.2em] text-cyan uppercase flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Crônicas Registradas
                </h3>
                <div className="grid gap-4">
                   {loreLoading ? (
                      <div className="h-40 animate-pulse bg-muted/10 rounded border border-border/40" />
                   ) : loreChapters?.map((chapter: any) => (
                      <div key={chapter.id} className="panel p-6 flex flex-col md:flex-row gap-6 hover:border-cyan/40 transition-all bg-card/40">
                         <div className="w-full md:w-32 h-20 bg-muted rounded overflow-hidden shrink-0 border border-border/20">
                            {chapter.image_url && <img src={chapter.image_url} className="w-full h-full object-cover" />}
                         </div>
                         <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                               <h4 className="font-display font-bold tracking-widest text-lg uppercase">{chapter.title}</h4>
                               <div className="flex gap-2">
                                  <button onClick={() => { setEditingLore(chapter); setNewLore(chapter); window.scrollTo({top: 400, behavior: 'smooth'}) }} className="h-8 w-8 rounded border border-cyan/20 flex items-center justify-center text-cyan hover:bg-cyan hover:text-black transition-all"><Edit2 className="h-4 w-4" /></button>
                                  <button onClick={() => { if(confirm("Apagar capítulo?")) deleteLoreMutation.mutate(chapter.id) }} className="h-8 w-8 rounded border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                               </div>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 italic">"{chapter.content}"</p>
                            <div className="flex items-center gap-4 text-[10px] font-display tracking-widest uppercase opacity-60">
                               <span className="flex items-center gap-1"><Layout className="h-3 w-3" /> Ordem: {chapter.order_index}</span>
                               <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Slug: {chapter.slug}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* MODAL DE EDIÇÃO */}
      <Dialog open={!!editingChamp} onOpenChange={(open) => !open && setEditingChamp(null)}>
        <DialogContent className="max-w-2xl bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="font-display text-xl uppercase tracking-widest text-primary flex items-center gap-2">
              <Edit2 className="h-5 w-5" /> RECONFIGURAR DEIDADE
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-4 py-4">
             <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest">NOME</Label>
                  <Input value={newChamp.name} onChange={e => setNewChamp({...newChamp, name: e.target.value})} className="bg-card" />
                </div>
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label className="text-[10px] tracking-widest">TIER</Label>
                    <Input type="number" min="1" max="5" value={newChamp.tier} onChange={e => setNewChamp({...newChamp, tier: parseInt(e.target.value)})} className="bg-card" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label className="text-[10px] tracking-widest">SLUG</Label>
                    <Input value={newChamp.slug} disabled className="bg-card opacity-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest">ORIGENS</Label>
                  <Input value={newChamp.origins} onChange={e => setNewChamp({...newChamp, origins: e.target.value})} className="bg-card" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest">CLASSES</Label>
                  <Input value={newChamp.classes} onChange={e => setNewChamp({...newChamp, classes: e.target.value})} className="bg-card" />
                </div>
             </div>
             
             <div className="space-y-4">
                <ImageUploadField 
                  label="EDITAR RETRATO" 
                  value={newChamp.image_url} 
                  onUpload={async (file) => {
                    const url = await handleUpload(file, 'portrait', newChamp.slug);
                    if (url) setNewChamp({...newChamp, image_url: url});
                  }}
                  isUploading={isUploading}
                />
                <ImageUploadField 
                  label="EDITAR ARTE DE AÇÃO" 
                  value={newChamp.action_image_url} 
                  onUpload={async (file) => {
                    const url = await handleUpload(file, 'action', newChamp.slug);
                    if (url) setNewChamp({...newChamp, action_image_url: url});
                  }}
                  isUploading={isUploading}
                />
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest">HISTÓRIA</Label>
                  <Textarea value={newChamp.description} onChange={e => setNewChamp({...newChamp, description: e.target.value})} className="bg-card h-[100px]" />
                </div>
             </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingChamp(null)} className="font-display tracking-widest">CANCELAR</Button>
            <Button 
              className="bg-primary text-black font-display font-bold tracking-widest shadow-glow px-8"
              onClick={() => upsertMutation.mutate(newChamp)}
              disabled={upsertMutation.isPending}
            >
              {upsertMutation.isPending ? <Loader2 className="animate-spin" /> : "SALVAR ALTERAÇÕES"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ImageUploadField({ label, value, onUpload, isUploading }: { label: string, value: string, onUpload: (file: File) => void, isUploading: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">{label}</Label>
      <div className="flex gap-3">
        <div className="h-10 w-10 shrink-0 rounded border border-dashed border-border flex items-center justify-center bg-card relative overflow-hidden group">
          {value ? (
            <img src={value} className="h-full w-full object-cover" />
          ) : (
            <User className="h-4 w-4 text-muted-foreground/40" />
          )}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="h-4 w-4 text-white" />
          </button>
        </div>
        <div className="flex-1 relative">
          <Input value={value} readOnly placeholder="URL ou upload..." className="bg-background pr-10 text-[10px]" />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-0 top-0 h-10 w-10 hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </div>
      </div>
    </div>
  );
}


function StatCard({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="panel p-4 border-border/40 bg-card/50 flex items-center justify-between">
      <div className="space-y-1">
        <div className="text-[10px] font-display text-muted-foreground tracking-widest uppercase">{label}</div>
        <div className="text-xl font-display font-black text-white">{value}</div>
      </div>
      <div className="h-10 w-10 rounded border border-border/20 flex items-center justify-center bg-background">
        {icon}
      </div>
    </div>
  );
}
