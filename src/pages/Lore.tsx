import { useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { TypewriterGlitch } from "@/components/lore/TypewriterGlitch";
import { ChevronDown, Volume2, VolumeX, Cpu, Zap, Globe } from "lucide-react";
import { useState } from "react";

export default function Lore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: chapters, isLoading } = useQuery({
    queryKey: ['lore'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lore_chapters')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Toggle Ambiência
  useEffect(() => {
    if (!isMuted) {
      if (!audioRef.current) {
        audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3"); // Placeholder para hum de servidor
        audioRef.current.loop = true;
        audioRef.current.volume = 0.2;
      }
      audioRef.current.play().catch(e => console.log("Interação requerida para áudio"));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [isMuted]);

  return (
    <div className="relative bg-black text-white selection:bg-cyan selection:text-black">
      <Navbar />

      {/* Controle de Áudio */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-8 left-8 z-50 p-3 rounded-full bg-black/40 border border-cyan/20 backdrop-blur-md text-cyan hover:bg-cyan/20 transition-all group"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5 animate-pulse" />}
        <span className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-display tracking-widest uppercase py-1 bg-black/80 px-2 rounded">
          {isMuted ? "Ativar Ambiência" : "Silenciar Sistema"}
        </span>
      </button>

      {/* Container Snap Scroll */}
      <div 
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar"
      >
        {isLoading ? (
          <div className="h-screen flex items-center justify-center bg-black">
             <div className="space-y-4 text-center">
                <div className="h-12 w-12 border-4 border-cyan border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-[10px] font-display tracking-[0.5em] text-cyan animate-pulse uppercase">Recuperando memórias do sistema...</div>
             </div>
          </div>
        ) : (
          chapters?.map((chapter: any, index: number) => (
            <LoreSection 
              key={chapter.id} 
              chapter={chapter} 
              index={index} 
              isLast={index === (chapters.length - 1)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function LoreSection({ chapter, index, isLast }: { chapter: any, index: number, isLast: boolean }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full snap-start overflow-hidden flex items-center justify-center"
    >
      {/* Background Parallax */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black z-10" />
        <div className="absolute inset-0 bg-black/20 z-10 backdrop-grayscale-[0.5]" />
        {chapter.image_url ? (
           <img src={chapter.image_url} className="w-full h-full object-cover" alt="" />
        ) : (
           <div className="w-full h-full bg-[#0a0a10] border-2 border-cyan/5 flex items-center justify-center">
              <Globe className="h-64 w-64 text-cyan/5 animate-pulse" />
           </div>
        )}
      </motion.div>

      {/* Floating Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 container max-w-4xl px-6 text-center space-y-8"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 text-cyan"
          >
            <Cpu className="h-5 w-5" />
            <span className="text-[10px] font-display tracking-[0.5em] uppercase font-bold text-shadow-glow">
              Capítulo {index + 1} // Protocolo de Memória
            </span>
            <Zap className="h-5 w-5" />
          </motion.div>

          <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none break-words">
            <TypewriterGlitch 
              text={chapter.title} 
              speed={40} 
              delay={300}
            />
          </h2>
          
          <div className="h-1 w-24 bg-cyan mx-auto mt-4 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="space-y-6"
        >
          <p className="text-lg md:text-xl text-cyan/80 font-light leading-relaxed font-serif italic max-w-2xl mx-auto">
            {chapter.content}
          </p>
          
          {!isLast && (
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="pt-12 text-muted-foreground/40"
            >
              <div className="text-[10px] font-display tracking-[0.3em] uppercase mb-2">Deslizar para prosseguir</div>
              <ChevronDown className="h-6 w-6 mx-auto" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Overlay de Vinheta */}
      <div className="absolute inset-0 z-15 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </section>
  );
}
