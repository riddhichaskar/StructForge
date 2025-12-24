"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    const xOffset = (Math.random() - 0.5) * 400;
    const yOffset = (Math.random() - 0.5) * 400;
    const duration = 20 + Math.random() * 10;

    return (
        <motion.div
            initial={{ opacity: 0, x: 0, y: 0, rotate: rotate }}
            animate={{
                opacity: 1,
                x: [0, xOffset, 0],
                y: [0, yOffset, 0],
                rotate: [rotate, rotate + 10, rotate],
            }}
            transition={{
                duration: duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                opacity: { duration: 2, delay: delay },
            }}
            className={cn("absolute", className)}
            style={{ width, height }}
        >
            <div
                className={cn(
                    "absolute inset-0 rounded-full",
                    "bg-gradient-to-r to-transparent",
                    gradient,
                    "backdrop-blur-[2px] border-2 border-black/[0.15] dark:border-white/[0.15]",
                    "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                    "after:absolute after:inset-0 after:rounded-full",
                    "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                )}
            />
        </motion.div>
    );
}

// --- NEW LOOPING TYPEWRITER ---
function LoopingTypewriter({ words, className }: { words: string[]; className?: string }) {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % words.length;
            const fullText = words[i];

            setText(isDeleting 
                ? fullText.substring(0, text.length - 1) 
                : fullText.substring(0, text.length + 1)
            );

            // Typing Speed Logic
            setTypingSpeed(isDeleting ? 50 : 150);

            if (!isDeleting && text === fullText) {
                // Word Finished -> Pause before deleting
                setTimeout(() => setIsDeleting(true), 2000); 
            } else if (isDeleting && text === "") {
                // Deletion Finished -> Move to next word
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed, words]);

    return (
        <span className={className}>
            {text}
            <span className="animate-blink">|</span>
        </span>
    );
}

function HeroGeometric({
    badge = "StructForge",
    words = ["Visualize", "Scaffold", "Document"], // Default words
    staticSuffix = "Your Project Architecture",
    subheading = "The ultimate bridge between documentation and development.",
    children,
}: {
    badge?: string;
    words?: string[];
    staticSuffix?: string;
    subheading?: string;
    children?: React.ReactNode;
}) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1] as const,
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full bg-background overflow-x-hidden transition-colors duration-300">
            {/* BACKGROUND SHAPES */}
            <div className="absolute inset-0 h-full w-full z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
                
                <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-indigo-500/[0.3] dark:from-indigo-500/[0.15]" className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" />
                <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-rose-500/[0.3] dark:from-rose-500/[0.15]" className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" />
                <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-violet-500/[0.3] dark:from-violet-500/[0.15]" className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" />
                <ElegantShape delay={0.6} width={200} height={60} rotate={20} gradient="from-amber-500/[0.3] dark:from-amber-500/[0.15]" className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]" />
                <ElegantShape delay={0.7} width={150} height={40} rotate={-25} gradient="from-cyan-500/[0.3] dark:from-cyan-500/[0.15]" className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]" />
                
                {/* Scroll Reveal Shapes */}
                <ElegantShape delay={0.5} width={600} height={100} rotate={15} gradient="from-emerald-500/[0.3] dark:from-emerald-500/[0.15]" className="right-[-10%] top-[115%] opacity-80" />
                <ElegantShape delay={0.6} width={400} height={80} rotate={-10} gradient="from-pink-500/[0.3] dark:from-pink-500/[0.15]" className="left-[5%] top-[135%]" />
                <ElegantShape delay={0.7} width={500} height={120} rotate={5} gradient="from-blue-500/[0.3] dark:from-blue-500/[0.15]" className="right-[15%] top-[160%]" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none z-0" />

            {/* CONTENT LAYER */}
            <div className="relative z-10">
                <div className="min-h-screen flex flex-col items-center justify-center container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-6 md:mb-8 flex flex-col items-center gap-2">
                            {/* LOOPING TYPEWRITER TEXT */}
                            <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
                                <LoopingTypewriter 
                                    words={words} 
                                    className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 dark:from-indigo-300 dark:via-white/90 dark:to-rose-300"
                                />
                            </motion.div>

                            {/* STATIC SUFFIX TEXT */}
                            <motion.h1
                                custom={2}
                                variants={fadeUpVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-foreground"
                            >
                                {staticSuffix}
                            </motion.h1>
                        </div>

                        <motion.div
                            custom={3}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
                                {subheading}
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-6 pb-24">
                   {children}
                </div>
            </div>
        </div>
    );
}

export { HeroGeometric };