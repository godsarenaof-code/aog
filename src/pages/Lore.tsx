import { useRef, useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { TypewriterGlitch } from "@/components/lore/TypewriterGlitch";
import { 
  Volume2, VolumeX, Cpu, Zap, ChevronLeft, ChevronRight, 
  Loader2, Info
} from "lucide-react";

export default function Lore() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const nextSlide = useCallback(() => {
    if (!chapters) return;
    setCurrentIndex((prev) => (prev + 1) % chapters.length);
  }, [chapters]);

  const prevSlide = useCallback(() => {
    if (!chapters) return;
    setCurrentIndex((prev) => (prev - 1 + chapters.length) % chapters.length);
  }, [chapters]);

  // Autoplay Logic
  useEffect(() => {
    if (isPaused || !chapters || chapters.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(nextSlide, 7000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, chapters, nextSlide]);

  // Audio Ambiência
  useEffect(() => {
    if (!isMuted) {
      if (!audioRef.current) {
        audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.15;
      }
      audioRef.current.play().catch(() => console.log("Interação requerida"));
    } else {
      audioRef.current?.pause();
    }
    return () => audioRef.current?.pause();
  }, [isMuted]);

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center space-y-6">
        <Loader2 className="h-12 w-12 text-cyan animate-spin" />
        <div className="text-[10px] font-display tracking-[0.5em] text-cyan animate-pulse uppercase">Iniciando Protocolo A.o.G...</div>
      </div>
    );
  }

  const currentChapter = chapters?.[currentIndex];

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden font-display">
      <Navbar />

      {/* Audio Control */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-8 left-8 z-50 p-3 rounded-full bg-black/40 border border-cyan/20 backdrop-blur-md text-cyan hover:bg-cyan/20 transition-all group"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5 animate-pulse" />}
      </button>

      {/* Main Slider Engine */}
      <AnimatePresence mode="wait">
        {currentChapter && (
          <motion.div
            key={currentChapter.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Ken Burns Background */}
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 12, ease: "linear" }}
              className="absolute inset-0 z-0"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-black/40 z-10" />
              {currentChapter.image_url ? (
                <img src={currentChapter.image_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full bg-[#050510] flex items-center justify-center opacity-20">
                  <Zap className="h-64 w-64 text-cyan" />
                </div>
              )}
            </motion.div>

            {/* Content Plate */}
            <div className="relative z-20 h-full flex items-center justify-center px-6">
              <div className="max-w-4xl w-full space-y-12 text-center md:text-left">
                
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center md:justify-start gap-4 text-cyan"
                >
                  <div className="h-px w-12 bg-cyan/40" />
                  <span className="text-[10px] tracking-[0.5em] font-bold uppercase">
                    ATUADOR {currentIndex + 1} // CRÔNICA DIGITAL
                  </span>
                </motion.div>

                <div className="space-y-6">
                  <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
                    <TypewriterGlitch 
                      text={currentChapter.title} 
                      speed={50} 
                      delay={800}
                    />
                  </h2>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="relative"
                  >
                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-cyan hidden md:block" />
                    <p className="text-xl md:text-3xl text-cyan/70 font-light leading-snug max-w-3xl">
                      {currentChapter.content}
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="flex items-center justify-center md:justify-start gap-3 text-[10px] tracking-[0.3em] text-muted-foreground uppercase"
                >
                  <Cpu className="h-3 w-3" /> STATUS: OK // AGUARDANDO COMANDO
                </motion.div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-x-0 bottom-12 z-40 px-12 flex items-center justify-between">
        <div className="flex gap-4">
          <button 
            onClick={prevSlide}
            className="h-12 w-12 rounded-full border border-cyan/20 flex items-center justify-center text-cyan hover:bg-cyan hover:text-black transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="h-12 w-12 rounded-full border border-cyan/20 flex items-center justify-center text-cyan hover:bg-cyan hover:text-black transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Bullets */}
        <div className="flex gap-2">
          {chapters?.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === idx ? 'w-12 bg-cyan' : 'w-3 bg-cyan/20'}`}
            />
          ))}
        </div>

        {/* Timer Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-cyan/10 w-full">
           <motion.div 
             key={currentIndex}
             initial={{ width: 0 }}
             animate={{ width: isPaused ? 'inherit' : '100%' }}
             transition={{ duration: isPaused ? 0 : 7, ease: "linear" }}
             className="h-full bg-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]"
           />
        </div>
      </div>

      {/* Border Vinheta Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20 z-30" />
    </div>
  );
}
