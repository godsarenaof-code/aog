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
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
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

  // Speech Synthesis Logic
  const speakContent = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    if (isMuted || volume === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    utterance.volume = volume;
    speechRef.current = utterance;
    
    window.speechSynthesis.speak(utterance);
  }, [isMuted, volume]);

  useEffect(() => {
    if (chapters && chapters[currentIndex]) {
      speakContent(chapters[currentIndex].content);
    }
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [currentIndex, chapters, speakContent]);

  // Audio Ambiência
  useEffect(() => {
    if (!isMuted && volume > 0) {
      if (!audioRef.current) {
        audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f694b.mp3?filename=sci-fi-ambience-11042.mp3");
        audioRef.current.loop = true;
      }
      audioRef.current.volume = volume * 0.3;
      audioRef.current.play().catch(e => console.log("Audio play blocked"));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    return () => audioRef.current?.pause();
  }, [isMuted, volume]);

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

      {/* Top Progress Bar & Audio Controls */}
      <div className="fixed top-20 inset-x-0 z-50 flex flex-col items-center">
        <div className="w-full h-[2px] bg-white/5 relative overflow-hidden">
          <motion.div 
            key={currentIndex}
            initial={{ width: 0 }}
            animate={{ width: isPaused ? '0%' : '100%' }}
            transition={{ duration: isPaused ? 0 : 7, ease: "linear" }}
            className="h-full bg-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          />
        </div>
        
        <div className="container flex justify-between items-center px-6 pt-4">
           {/* Info Pill */}
           <div className="hidden md:flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-cyan/10 text-[10px] tracking-[0.3em] font-bold text-cyan/60">
             <Cpu className="h-3 w-3 animate-pulse" /> SYSTEM_STATUS: IMMERSIVE
           </div>

           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-cyan/20">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:text-cyan transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                
                <div className="flex items-center gap-1 border-l border-cyan/10 pl-2 pr-2">
                  <button 
                    onClick={() => setVolume(prev => Math.max(0, prev - 0.1))}
                    className="h-6 w-6 flex items-center justify-center hover:bg-cyan/10 rounded-full text-[10px] font-bold leading-none"
                  >
                    -
                  </button>
                  <div className="w-16 h-1 bg-cyan/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan transition-all duration-300" 
                      style={{ width: `${volume * 100}%` }}
                    />
                  </div>
                  <button 
                    onClick={() => setVolume(prev => Math.min(1, prev + 0.1))}
                    className="h-6 w-6 flex items-center justify-center hover:bg-cyan/10 rounded-full text-[10px] font-bold leading-none"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = '/'}
                className="h-10 w-10 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-cyan/20 hover:border-red-500/50 hover:text-red-500 transition-all font-display text-xl"
              >
                ×
              </button>
           </div>
        </div>
      </div>

      {/* Main Slider Engine */}
      <AnimatePresence mode="wait">
        {currentChapter && (
          <motion.div
            key={currentChapter.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Ken Burns Background */}
            <motion.div 
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute inset-0 z-0"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 z-10" />
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
              <div className="max-w-5xl w-full space-y-12 text-center">
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-4 text-cyan/60"
                >
                  <div className="h-px w-8 bg-cyan/30" />
                  <span className="text-[10px] tracking-[0.8em] font-bold uppercase">
                    PROTOCOL A.O.G // TRANSMISSION {currentIndex + 1}
                  </span>
                  <div className="h-px w-8 bg-cyan/30" />
                </motion.div>

                <div className="space-y-8">
                  <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                    <TypewriterGlitch 
                      text={currentChapter.title} 
                      speed={40} 
                      delay={500}
                    />
                  </h2>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                  >
                    <p className="text-xl md:text-3xl text-cyan/80 font-light leading-relaxed max-w-4xl mx-auto italic">
                      "{currentChapter.content}"
                    </p>

                    {currentIndex === chapters.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2, type: "spring" }}
                        className="mt-12 flex justify-center"
                      >
                        <LeadCaptureModal>
                          <Button className="bg-cyan hover:bg-cyan/90 text-black font-display font-black tracking-[0.3em] h-16 px-12 text-lg shadow-[0_0_30px_rgba(34,211,238,0.5)] border-none group transition-all duration-500">
                             <span className="group-hover:scale-110 transition-transform flex items-center gap-2">
                               ACEITAR PROTOCOLO DE ACESSO <Zap className="h-5 w-5 fill-black" />
                             </span>
                          </Button>
                        </LeadCaptureModal>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-x-0 bottom-12 z-40 px-12 flex items-center justify-between">
        <div className="flex gap-6">
          <button 
            onClick={prevSlide}
            className="h-14 w-14 rounded-full border border-cyan/40 flex items-center justify-center text-[#22d3ee] hover:bg-cyan/20 hover:shadow-cyan-glow transition-all duration-300"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={nextSlide}
            className="h-14 w-14 rounded-full border border-cyan/40 flex items-center justify-center text-[#22d3ee] hover:bg-cyan/20 hover:shadow-cyan-glow transition-all duration-300"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Bullets */}
        <div className="flex gap-3">
          {chapters?.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 transition-all duration-700 rounded-full ${currentIndex === idx ? 'w-16 bg-cyan shadow-cyan-glow' : 'w-4 bg-cyan/10 hover:bg-cyan/30'}`}
            />
          ))}
        </div>
      </div>

      {/* Border Vinheta Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-30" />
    </div>
  );
}
