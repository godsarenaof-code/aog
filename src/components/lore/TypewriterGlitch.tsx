import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterGlitchProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  once?: boolean;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export function TypewriterGlitch({ text, className, speed = 50, delay = 0, once = true }: TypewriterGlitchProps) {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (delay > 0) {
      timeout = setTimeout(() => setIsAnimating(true), delay);
    } else {
      setIsAnimating(true);
    }
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!isAnimating) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => {
        const result = text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("");

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
        return result;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isAnimating, text, speed]);

  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once }}
    >
      {displayText}
    </motion.div>
  );
}
