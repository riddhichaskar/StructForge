"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Loader2, ImageDown, AlertTriangle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileTree } from "@/components/ui/file-tree";
import { AnimatedSparkle } from "@/components/ui/AnimatedSparkle";
import { TypewriterLoader } from "@/components/ui/TypewriterLoader";
import { type UITreeNode } from "@/lib/tree-utils";
import { type PreviewResponse } from "@/lib/api";

interface TreeVisualizerProps {
  status: "IDLE" | "UPLOADING" | "ANALYZING" | "READY";
  rootNode: UITreeNode | null;
  summary: PreviewResponse["summary"] | null;
  fileName: string | null;
  onError: (msg: string) => void;
}

export function TreeVisualizer({ status, rootNode, summary, fileName, onError }: TreeVisualizerProps) {
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const treeContainerRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = async () => {
    if (treeContainerRef.current === null) return;
    setIsDownloadingImage(true);

    try {
        const dataUrl = await toPng(treeContainerRef.current, { 
            cacheBust: true,
            backgroundColor: document.documentElement.classList.contains('dark') ? '#09090b' : '#f8fafc',
            style: { padding: '40px' } 
        });
        
        const link = document.createElement('a');
        link.download = `${fileName?.replace('.zip', '') || 'tree'}-viz.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error(err);
        onError("Failed to generate PNG image.");
    } finally {
        setIsDownloadingImage(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <span className="font-bold text-lg tracking-tight">Tree Visualization</span>
            
            <div className="flex items-center gap-3">
                {status === "READY" && (
                    <>
                    <Button 
                        variant="ghost" size="sm" 
                        onClick={handleDownloadPng}
                        disabled={isDownloadingImage}
                        className="hidden md:flex hover:bg-green-500/10 hover:text-green-500 transition-colors"
                    >
                        {isDownloadingImage ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <ImageDown className="w-4 h-4 mr-2" />}
                        PNG
                    </Button>

                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">Live</span>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Content Area */}
        <div 
            ref={treeContainerRef} 
            className="flex-1 overflow-y-auto p-6 bg-black/5 dark:bg-black/20"
        >
            {status === "ANALYZING" && (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                    <TypewriterLoader onComplete={() => {}} /> 
                </div>
            )}

            {status === "READY" && rootNode && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                >
                    {summary && !summary.valid && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-4">
                            <h4 className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-500 mb-2">
                                <AlertTriangle className="h-5 w-5" /> Normalization Applied
                            </h4>
                            <ul className="space-y-1 pl-1">
                                {summary.fixes?.map((fix, i) => (
                                    <li key={i} className="text-xs md:text-sm text-amber-700/80 dark:text-amber-400/80 flex items-center gap-2">
                                        <CheckCircle2 className="h-3 w-3" /> {fix}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="pl-2">
                        <FileTree root={rootNode} />
                    </div>
                </motion.div>
            )}

            {(status === "IDLE" || status === "UPLOADING") && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40">
                    <AnimatedSparkle />
                    <p className="text-lg font-medium">Waiting for archive...</p>
                </div>
            )}
        </div>
    </div>
  );
}