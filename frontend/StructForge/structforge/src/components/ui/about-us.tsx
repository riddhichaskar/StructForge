"use client";

import { Github, Layers, Linkedin } from "lucide-react";

export const AboutUs = () => {
  return (
    <footer className="mt-32 border-t border-black/10 dark:border-white/10 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* Logo / Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Layers size={24} />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-foreground">About StructForge</h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
          StructForge was born from a simple frustration: the difficulty of visualizing 
          and communicating complex directory structures. We're on a mission to bridge 
          the gap between ASCII text, file systems, and human understanding.
        </p>

        {/* Social / Links */}
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://github.com/riddhichaskar" className="flex items-center gap-2 px-5 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-foreground font-medium text-sm border border-black/5 dark:border-white/5">
            <Github size={16} />
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/riddhi-chaskar" className="flex items-center gap-2 px-5 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-foreground font-medium text-sm border border-black/5 dark:border-white/5">
            <Linkedin size={16} />
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-sm text-muted-foreground/60">
          <p>&copy; {new Date().getFullYear()} StructForge. Open Source & Privacy Focused.</p>
        </div>
      </div>
    </footer>
  );
};