"use client";

import { useState, useEffect } from "react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { api } from "@/lib/api";

// --- MODULAR UI COMPONENTS ---
import { SystemStatus } from "@/components/ui/system-status";
import { ErrorToast } from "@/components/ui/ErrorToast";
import { AboutUs } from "@/components/ui/about-us"; // Import the new component

export default function LandingPage() {
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthy = await api.checkHealth();
        setIsBackendOnline(healthy);
      } catch (e) {
        setIsBackendOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <SystemStatus isOnline={isBackendOnline} />
      
      <ErrorToast 
        message={errorMessage} 
        onClose={() => setErrorMessage(null)} 
      />

      <HeroGeometric 
        badge="StructForge" 
        words={["Visualize", "Scaffold", "Document"]} 
        staticSuffix="Your Project Architecture"
        subheading="The ultimate bridge between documentation and development. Turn your tree command outputs into clear, shareable, and usable project maps."
      >
          {/* MAIN CONTENT WRAPPER */}
          <div className="space-y-24 py-20 text-foreground">
            
            {/* --- FEATURE CARDS (Option A) --- */}
            
            {/* Card 1 */}
            <section className="h-[400px] flex flex-col justify-center bg-black/5 dark:bg-white/5 rounded-3xl p-12 border border-black/10 dark:border-white/10 backdrop-blur-md transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 group">
                <div className="w-12 h-12 mb-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>
                </div>
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    Generate in Seconds
                </h2>
                <p className="mt-6 text-muted-foreground text-xl leading-relaxed max-w-2xl">
                    Stop creating folders one by one. Simply type or paste your directory tree in 
                    standard ASCII format, and we'll instantly generate a downloadable ZIP file 
                    ready for your project.
                </p>
            </section>
            
            {/* Card 2 */}
            <section className="h-[400px] flex flex-col justify-center bg-black/5 dark:bg-white/5 rounded-3xl p-12 border border-black/10 dark:border-white/10 backdrop-blur-md transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:border-pink-500/30 dark:hover:border-pink-400/30 group">
                <div className="w-12 h-12 mb-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                </div>
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-400 dark:to-rose-400">
                    Interactive Mapping
                </h2>
                <p className="mt-6 text-muted-foreground text-xl leading-relaxed max-w-2xl">
                    Upload any existing ZIP archive to see a beautiful, interactive node graph 
                    of your file system. Collapse complex folders and gain a high-level 
                    understanding of legacy codebases instantly.
                </p>
            </section>

            {/* Card 3 */}
            <section className="h-[400px] flex flex-col justify-center bg-black/5 dark:bg-white/5 rounded-3xl p-12 border border-black/10 dark:border-white/10 backdrop-blur-md transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-400/30 group">
                <div className="w-12 h-12 mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                    Zero-Server Processing
                </h2>
                <p className="mt-6 text-muted-foreground text-xl leading-relaxed max-w-2xl">
                    Your intellectual property never leaves your device. All file parsing, 
                    generation, and visualization happens 100% locally in your browser 
                    using advanced client-side technologies.
                </p>
            </section>

            <AboutUs />

          </div>
      </HeroGeometric>
    </div>
  );
}