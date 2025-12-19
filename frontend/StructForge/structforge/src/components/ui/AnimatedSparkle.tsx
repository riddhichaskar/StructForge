"use client";
import { motion } from "framer-motion";

export function AnimatedSparkle() {
  return (
    <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
      <motion.svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-16 h-16 text-indigo-500/80 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.8, 1, 0.8],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </motion.svg>
      {/* Satellites */}
      <motion.svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-0 right-0 w-6 h-6 text-purple-400" animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}>
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </motion.svg>
      <motion.svg viewBox="0 0 24 24" fill="currentColor" className="absolute bottom-1 left-2 w-4 h-4 text-blue-400" animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}>
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </motion.svg>
       <motion.svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-4 left-0 w-3 h-3 text-white" animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}>
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </motion.svg>
    </div>
  );
}