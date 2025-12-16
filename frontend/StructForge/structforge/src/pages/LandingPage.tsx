import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function LandingPage() {
  return (
    <HeroGeometric 
      badge="StructForge" 
      title1="Build Your Future" 
      title2="With Modern Tech"
    >
        {/* SCROLLABLE CONTENT STARTS HERE */}
        <div className="space-y-24 py-20 text-white">
            
            <section className="h-[500px] bg-white/5 rounded-2xl p-10 border border-white/10 backdrop-blur-md">
                <h2 className="text-3xl font-bold">Section 1: The Vision</h2>
                <p className="mt-4 text-gray-400">
                    This is your first scrollable section. Notice how the background shapes 
                    move naturally with the scroll because we switched to absolute positioning.
                </p>
            </section>
            
            <section className="h-[500px] bg-white/5 rounded-2xl p-10 border border-white/10 backdrop-blur-md">
                <h2 className="text-3xl font-bold">Section 2: The Technology</h2>
                <p className="mt-4 text-gray-400">
                    As you scroll down here, the new shapes (emerald and pink) 
                    positioned at 115% and 135% will reveal themselves.
                </p>
            </section>

            <section className="h-[500px] bg-white/5 rounded-2xl p-10 border border-white/10 backdrop-blur-md">
                <h2 className="text-3xl font-bold">Section 3: The Future</h2>
                <p className="mt-4 text-gray-400">
                    Finally, the blue and orange shapes appear near the bottom.
                </p>
            </section>

        </div>
    </HeroGeometric>
  );
}