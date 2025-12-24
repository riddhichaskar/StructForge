"use client";

import { useState, useEffect } from "react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { api } from "@/lib/api";

// --- MODULAR UI COMPONENTS ---
import { SystemStatus } from "@/components/ui/system-status";
import { ErrorToast } from "@/components/ui/ErrorToast";

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
        // Option 2: The Looping Words
        words={["Visualize", "Scaffold", "Document"]} 
        // Option 2: The Static Suffix
        staticSuffix="Your Project Architecture"
        // Option 2: The Subheading
        subheading="The ultimate bridge between documentation and development. Turn your tree command outputs into clear, shareable, and usable project maps."
      >
          {/* SCROLLABLE CONTENT SECTIONS */}
          <div className="space-y-24 py-20 text-foreground">
              
              <section className="h-[500px] bg-black/5 dark:bg-white/10 rounded-2xl p-10 border border-black/10 dark:border-white/20 backdrop-blur-md transition-all hover:border-black/20 dark:hover:border-white/30">
                  <h2 className="text-3xl font-bold">From Chaos to Clarity</h2>
                  <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                      Transform complex directory structures into intuitive visual maps. 
                      Perfect for documentation, onboarding, and understanding legacy codebases.
                  </p>
              </section>
              
              <section className="h-[500px] bg-black/5 dark:bg-white/10 rounded-2xl p-10 border border-black/10 dark:border-white/20 backdrop-blur-md transition-all hover:border-black/20 dark:hover:border-white/30">
                  <h2 className="text-3xl font-bold">Scaffold Instantly</h2>
                  <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                      Don't waste time creating folders manually. Type your structure in 
                      simple text format and generate a ready-to-use ZIP file in seconds.
                  </p>
              </section>

              <section className="h-[500px] bg-black/5 dark:bg-white/10 rounded-2xl p-10 border border-black/10 dark:border-white/20 backdrop-blur-md transition-all hover:border-black/20 dark:hover:border-white/30">
                  <h2 className="text-3xl font-bold">Secure & Local</h2>
                  <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                      Your data never leaves your browser for processing. 
                      Experience lightning-fast conversions with zero privacy concerns.
                  </p>
              </section>

          </div>
      </HeroGeometric>
    </div>
  );
}