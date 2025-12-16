import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function LandingPage() {
  return (
    <HeroGeometric 
      badge="StructForge" 
      title1="Build Your Future" 
      title2="With Modern Tech"
    >
        {/* SCROLLABLE CONTENT */}
        <div className="space-y-24 py-20 text-foreground">
            
            {/* Increased dark mode opacity for bg and border to make boxes visible */}
            <section className="h-[500px] bg-black/5 dark:bg-white/10 rounded-2xl p-10 border border-black/10 dark:border-white/20 backdrop-blur-md">
                <h2 className="text-3xl font-bold">Section 1: The Vision</h2>
                <p className="mt-4 text-muted-foreground">
                    This is your first scrollable section. Notice how the background shapes 
                    move naturally with the scroll because we switched to absolute positioning.
                </p>
            </section>
            
            <section className="h-[500px] bg-black/5 dark:bg-white/10 rounded-2xl p-10 border border-black/10 dark:border-white/20 backdrop-blur-md">
                <h2 className="text-3xl font-bold">Section 2: The Technology</h2>
                <p className="mt-4 text-muted-foreground">
                    As you scroll down here, the new shapes (emerald and pink) 
                    positioned at 115% and 135% will reveal themselves.
                </p>
            </section>

            <section className="h-[500px] bg-black/5 dark:bg-white/10 rounded-2xl p-10 border border-black/10 dark:border-white/20 backdrop-blur-md">
                <h2 className="text-3xl font-bold">Section 3: The Future</h2>
                <p className="mt-4 text-muted-foreground">
                    Finally, the blue and orange shapes appear near the bottom.
                </p>
            </section>

        </div>
    </HeroGeometric>
  );
}