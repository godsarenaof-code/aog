import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { champions as staticChampions } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Database, ShieldCheck, Upload, Database as DbIcon, Trash2, Edit2, Plus, Zap, Loader2, Camera, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
      // 1. Buscar deuses atuais para preservar imagens
      const { data: existingChamps } = await supabase.from('champions').select('slug, image_url, action_image_url');
      const imageMap = new Map();
      existingChamps?.forEach(c => imageMap.set(c.slug, { portrait: c.image_url, action: c.action_image_url }));

      // 2. Formatar dados estáticos preservando imagens se existirem
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
    ability: null as any // Armazena o objeto de habilidade
  });

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
              <h1 className="font-display text-4xl font-black uppercase tracking-tighter">Gestão de <span className="text-cyan">Deuses</span></h1>
              <p className="text-muted-foreground text-sm mt-1 uppercase font-display tracking-wider">Interface de Controle da Arena of Gods</p>
           </div>
           
           <div className="flex items-center gap-4">
              <Button 
                onClick={handleMigrate} 
                className="bg-purple-600 hover:bg-purple-700 text-white font-display tracking-widest"
                disabled={isMigrating}
              >
                <DbIcon className="mr-2 h-4 w-4" /> 
                {isMigrating ? "MIGRANDO..." : "IMPORTAR STATIC DATA"}
              </Button>
           </div>
        </div>

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

        {/* LISTA DE CAMPEÕES */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-4 text-[10px] font-display text-muted-foreground tracking-[0.3em] uppercase">
             <span>LISTAGEM ATUAL</span>
             <span>OPÇÕES</span>
           </div>
           
           <div className="grid gap-3">
              {isLoading ? (
                <div className="py-20 text-center animate-pulse font-display text-muted-foreground">SINCRONIZANDO COM A REDE...</div>
              ) : champions?.map((champion: any) => (
                <div key={champion.id} className="panel p-4 flex items-center justify-between group hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded border flex items-center justify-center font-display text-xl overflow-hidden ${champion.tier === 5 ? 'border-gold bg-gold/5 text-gold' : 'border-border bg-card'}`}>
                      {champion.image_url ? (
                        <img src={champion.image_url} className="h-full w-full object-cover" />
                      ) : (
                        champion.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-bold uppercase tracking-widest">{champion.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-display tracking-widest uppercase">TIER {champion.tier}</span>
                        <span className="text-[9px] text-muted-foreground uppercase">{(champion.origins || []).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-cyan border-cyan/20 bg-cyan/5 hover:bg-cyan/10"
                      onClick={() => openEditModal(champion)}
                      title="Editar Deus"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
                      onClick={() => {
                        if(confirm(`Desintegrar ${champion.name} do banco de dados?`)) deleteMutation.mutate(champion.id);
                      }}
                      title="Deletar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
           </div>
        </div>
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
