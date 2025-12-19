"use client";

import { useState, useEffect } from "react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { api } from "@/lib/api";

// --- MODULAR UI COMPONENTS ---
import { SystemStatus } from "@/components/ui/system-status";
import { ErrorToast } from "@/components/ui/ErrorToast";

export default function LandingPage() {
  // --- STATE ---
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- HEALTH CHECK POLLING ---
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthy = await api.checkHealth();
        setIsBackendOnline(healthy);
      } catch (e) {
        setIsBackendOnline(false);
        // Note: We don't trigger the ErrorToast here automatically on load
        // because a big red popup immediately upon visiting the landing page 
        // is bad UX. The "System Offline" red badge is sufficient warning.
      }
    };

    // 1. Check immediately
    checkHealth();

    // 2. Poll every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval); // Cleanup
  }, []);

  // --- HELPER (If you add interactive buttons later) ---
  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  return (
    <div className="relative">
      {/* GLOBAL STATUS INDICATOR */}
      <SystemStatus isOnline={isBackendOnline} />

      {/* ERROR TOAST (Ready for any future interactive errors) */}
      <ErrorToast 
        message={errorMessage} 
        onClose={() => setErrorMessage(null)} 
      />

      <HeroGeometric 
        badge="StructForge" 
        title1="Build Your Future" 
        title2="With Modern Tech"
      >
          {/* SCROLLABLE CONTENT */}
          <div className="space-y-24 py-20 text-foreground">
              
              <section className="h-[500px] bg-black/5 dark:bg-white/10 rounded-2xl p-10 border border-black/10 dark:border-white/20 backdrop-blur-md transition-all hover:border-black/20 dark:hover:border-white/30">
                  <h2 className="text-3xl font-bold">Section 1: The Vision</h2>
                  <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                      This is your first scrollable section. Notice how the background shapes 
                      move naturally with the scroll because we switched to absolute positioning.
                  </p>
              </section>
              
              <section className="h-[500px] bg-black/5 dark:bg-white/10 rounded-2xl p-10 border border-black/10 dark:border-white/20 backdrop-blur-md transition-all hover:border-black/20 dark:hover:border-white/30">
                  <h2 className="text-3xl font-bold">Section 2: The Technology</h2>
                  <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                      As you scroll down here, the new shapes (emerald and pink) 
                      positioned at 115% and 135% will reveal themselves.
                  </p>
              </section>

              <section className="h-[500px] bg-black/5 dark:bg-white/10 rounded-2xl p-10 border border-black/10 dark:border-white/20 backdrop-blur-md transition-all hover:border-black/20 dark:hover:border-white/30">
                  <h2 className="text-3xl font-bold">Section 3: The Future</h2>
                  <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                      Finally, the blue and orange shapes appear near the bottom.
                  </p>
              </section>

          </div>
      </HeroGeometric>
    </div>
  );
}