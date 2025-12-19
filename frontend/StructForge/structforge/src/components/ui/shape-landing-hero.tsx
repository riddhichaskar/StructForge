"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

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
    // Cinematic Drift Logic
    const xOffset = (Math.random() - 0.5) * 400;
    const yOffset = (Math.random() - 0.5) * 400;
    const duration = 20 + Math.random() * 10;

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: 0,
                y: 0,
                rotate: rotate,
            }}
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
                    // UPDATED BORDERS:
                    // border-black/[0.15] ensures visibility in light mode
                    // dark:border-white/[0.15] keeps it subtle in dark mode
                    "backdrop-blur-[2px] border-2 border-black/[0.15] dark:border-white/[0.15]", 
                    // UPDATED SHADOWS:
                    "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                    "after:absolute after:inset-0 after:rounded-full",
                    "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                )}
            />
        </motion.div>
    );
}

function Typewriter({ text, className }: { text: string; className?: string }) {
    const sentenceVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.5,
                staggerChildren: 0.08,
            },
        },
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 0 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.h1
            key={text}
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {text.split("").map((char, index) => (
                <motion.span key={`${char}-${index}`} variants={letterVariants}>
                    {char}
                </motion.span>
            ))}
        </motion.h1>
    );
}

function HeroGeometric({
    badge = "Design Collective",
    title1 = "Elevate Your Digital Vision",
    title2 = "Crafting Exceptional Websites",
    children,
}: {
    badge?: string;
    title1?: string;
    title2?: string;
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
            
            {/* NOISE REMOVED HERE */}

            {/* BACKGROUND LAYER */}
            <div className="absolute inset-0 h-full w-full z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
                
                {/* UPDATED SHAPES:
                   Added 'dark:' prefix to keep dark mode subtle.
                   Increased base opacity to [0.3] for Light Mode visibility.
                */}
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-indigo-500/[0.3] dark:from-indigo-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />
                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-rose-500/[0.3] dark:from-rose-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />
                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-violet-500/[0.3] dark:from-violet-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />
                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-amber-500/[0.3] dark:from-amber-500/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />
                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-cyan-500/[0.3] dark:from-cyan-500/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
                
                {/* Extended Shapes */}
                <ElegantShape
                    delay={0.5}
                    width={600}
                    height={100}
                    rotate={15}
                    gradient="from-emerald-500/[0.3] dark:from-emerald-500/[0.15]"
                    className="right-[-10%] top-[115%] opacity-80"
                />
                <ElegantShape
                    delay={0.6}
                    width={400}
                    height={80}
                    rotate={-10}
                    gradient="from-pink-500/[0.3] dark:from-pink-500/[0.15]"
                    className="left-[5%] top-[135%]"
                />
                <ElegantShape
                    delay={0.7}
                    width={500}
                    height={120}
                    rotate={5}
                    gradient="from-blue-500/[0.3] dark:from-blue-500/[0.15]"
                    className="right-[15%] top-[160%]"
                />
                <ElegantShape
                    delay={0.8}
                    width={250}
                    height={60}
                    rotate={-20}
                    gradient="from-orange-500/[0.3] dark:from-orange-500/[0.15]"
                    className="left-[-5%] top-[175%]"
                />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none z-0" />

            {/* CONTENT LAYER */}
            <div className="relative z-10">
                <div className="min-h-screen flex flex-col items-center justify-center container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="mb-6 md:mb-8">
                            <Typewriter 
                                text={title1 || ""}
                                className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80 mb-2"
                            />
                            
                            <motion.h1
                                custom={1}
                                variants={fadeUpVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight"
                            >
                                <span className={cn("bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 dark:from-indigo-300 dark:via-white/90 dark:to-rose-300")}>
                                    {title2}
                                </span>
                            </motion.h1>
                        </div>

                        <motion.div
                            custom={2}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                                Crafting exceptional digital experiences through
                                innovative design and cutting-edge technology.
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