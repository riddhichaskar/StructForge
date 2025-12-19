"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Download, RefreshCw, FolderInput, AlertTriangle, 
  CheckCircle2, Loader2 
} from "lucide-react";

// --- CORE IMPORTS ---
import { Button } from "@/components/ui/button";
import { FileTree } from "@/components/ui/file-tree";
import { api, type PreviewResponse } from "@/lib/api";
import { buildTree, type UITreeNode } from "@/lib/tree-utils";

// --- MODULAR UI COMPONENTS ---
import { AuroraBackground } from "@/components/background/AuroraBackground";
import { AnimatedSparkle } from "@/components/ui/AnimatedSparkle";
import { TypewriterLoader } from "@/components/ui/TypewriterLoader";
import { DownloadToast } from "@/components/ui/DownloadToast";
import { ErrorToast } from "@/components/ui/ErrorToast"; // <--- NEW IMPORT
import { RenameProjectModal } from "@/components/modals/RenameProjectModal";
import { SystemStatus } from "@/components/ui/system-status";
import { playSuccessSound, sendDesktopNotification } from "@/lib/sound-utils";

export default function TextToDirectoryPage() {
  // --- STATE MANAGEMENT ---
  const [input, setInput] = useState("");
  const [projectName, setProjectName] = useState("my-project");
  
  const [rootNode, setRootNode] = useState<UITreeNode | null>(null);
  const [summary, setSummary] = useState<PreviewResponse["summary"] | null>(null);
  
  const [status, setStatus] = useState<"IDLE" | "TYPING" | "PREPARING" | "READY">("IDLE");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  
  // Modal & Toast State
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // <--- NEW ERROR STATE
  
  const DEFAULT_INPUT = `project/
    src/
        components/
            Header.tsx
        utils/
            api.ts
    package.json
    README.md`;

  // --- INITIALIZATION & POLLING ---
  useEffect(() => {
    setInput(DEFAULT_INPUT);

    // Health Check Function
    const checkHealth = async () => {
      try {
        const healthy = await api.checkHealth();
        setIsBackendOnline(healthy);
      } catch (e) {
        setIsBackendOnline(false);
        // We don't toast here to avoid spamming the user every 30s if offline
      }
    };

    // 1. Check Immediately
    checkHealth();

    // 2. Poll every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    // 3. Notification Permissions
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // --- HELPERS ---
  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000); // Auto-dismiss error after 5s
  };

  // --- HANDLERS ---
  const handlePreview = async () => {
    if (!input.trim()) {
        triggerError("Please enter a directory structure first.");
        return;
    }

    setStatus("TYPING");
    setErrorMessage(null); // Clear previous errors

    try {
      const data = await api.preview(input);
      // Store data temporarily until typing animation finishes
      (window as any).__tempData = data;
    } catch (error: any) {
      console.error(error);
      // REPLACED ALERT WITH TOAST
      triggerError(error.message || "Failed to communicate with the backend. Is the server running?");
      setStatus("IDLE");
    }
  };

  const onTypingComplete = () => {
    setStatus("PREPARING");
    setTimeout(() => {
        const data = (window as any).__tempData;
        if (data && data.nodes) {
            const treeRoot = buildTree(data.nodes);
            setRootNode(treeRoot);
            setSummary(data.summary || null);
            setStatus("READY");
            playSuccessSound();
        } else {
            // If we got here but data is missing, something weird happened
            triggerError("Failed to parse the structure response.");
            setStatus("IDLE");
        }
    }, 800);
  };

  const confirmDownload = async () => {
    if (!projectName.trim()) {
        triggerError("Project name cannot be empty.");
        return;
    }

    setShowRenameModal(false);
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      // 1. Generate ZIP from Backend
      const blob = await api.generate(input, projectName);
      
      // 2. Trigger Browser Download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // 3. Show In-App Toast
      setShowDownloadToast(true);
      
      // 4. Trigger Desktop Notification
      await sendDesktopNotification(projectName);
      
      // Auto-hide toast
      setTimeout(() => setShowDownloadToast(false), 4000);
    } catch (error: any) {
      // REPLACED ALERT WITH TOAST
      console.error(error);
      triggerError(error.message || "Failed to generate ZIP file. Check your input syntax.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-700 ease-in-out">
      {/* Background Layer */}
      <AuroraBackground />
      
      {/* Status Indicator (Right Edge) - Now updates via polling */}
      <SystemStatus isOnline={isBackendOnline} />
      
      {/* Modals & Overlays */}
      <RenameProjectModal 
        open={showRenameModal}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onCancel={() => setShowRenameModal(false)}
        onConfirm={confirmDownload}
      />

      <DownloadToast 
        open={showDownloadToast} 
        onClose={() => setShowDownloadToast(false)} 
      />

      {/* NEW ERROR TOAST */}
      <ErrorToast 
        message={errorMessage} 
        onClose={() => setErrorMessage(null)} 
      />

      {/* Main Layout */}
      <div className="relative z-10 pt-24 pb-20 px-6 max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-12">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-4"
            >
              Text to Directory
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-muted-foreground font-light max-w-2xl"
            >
              Visualize your architecture instantly. 
              <span className="hidden md:inline"> Use 4 spaces or standard tree characters.</span>
            </motion.p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[750px]">
          
          {/* LEFT COLUMN: Input Area */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col h-full bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden"
          >
             {/* Project Name Input */}
             <div className="p-6 border-b border-white/5 bg-white/5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block flex items-center gap-2">
                    <FolderInput className="w-4 h-4" /> Project Context
                </label>
                <input 
                  type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} 
                  className="w-full bg-transparent text-2xl font-bold placeholder:text-muted-foreground/30 outline-none"
                  placeholder="name-your-project" 
                />
             </div>
             
             {/* Textarea */}
             <div className="flex-1 relative group">
                <textarea
                    value={input} onChange={(e) => setInput(e.target.value)}
                    className="absolute inset-0 w-full h-full bg-transparent p-6 font-mono text-base resize-none focus:outline-none text-foreground/90 placeholder:text-muted-foreground/30 leading-relaxed"
                    spellCheck={false} placeholder={`project/\n    src/\n        main.py`}
                />
             </div>
             
             {/* Action Bar */}
             <div className="p-6 border-t border-white/5 bg-white/5">
                 <Button 
                   onClick={handlePreview} 
                   className="w-full h-14 rounded-2xl text-lg font-semibold bg-foreground text-background hover:opacity-90 transition-all shadow-lg"
                   disabled={status === "TYPING" || status === "PREPARING" || !input}
                 >
                   {status === "TYPING" || status === "PREPARING" ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RefreshCw className="mr-2 h-5 w-5" />}
                   {status === "IDLE" || status === "READY" ? "Visualize Structure" : "Processing..."}
                 </Button>
             </div>
          </motion.div>

          {/* RIGHT COLUMN: Preview Area */}
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col h-full bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden relative"
          >
             {/* Preview Header */}
             <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                 <span className="font-bold text-lg tracking-tight">Live Preview</span>
                 {status === "READY" && (
                     <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                         <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                         </span>
                         <span className="text-xs font-bold text-green-600 dark:text-green-400">Generated</span>
                     </div>
                 )}
             </div>

             {/* Content Area (Scrollable) */}
             <div className="flex-1 overflow-y-auto p-6 bg-black/5 dark:bg-black/20">
                {status === "TYPING" && <TypewriterLoader onComplete={onTypingComplete} />}

                {status === "PREPARING" && (
                    <div className="h-full flex flex-col items-center justify-center gap-3 animate-pulse">
                        <FolderInput className="h-12 w-12 text-muted-foreground/50" />
                        <span className="text-muted-foreground font-medium">Structuring directories...</span>
                    </div>
                )}

                {status === "READY" && rootNode && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                        {summary && !summary.valid && (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-4">
                                <h4 className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-500 mb-2">
                                    <AlertTriangle className="h-5 w-5" /> Auto-Corrections Applied
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
                        <div className="pl-2"><FileTree root={rootNode} /></div>
                    </motion.div>
                )}

                {status === "IDLE" && (
                     <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40">
                        <AnimatedSparkle />
                        <p className="text-lg font-medium">Ready to visualize</p>
                    </div>
                )}
             </div>

             {/* Download Button Footer */}
             <div className="p-6 border-t border-white/5 bg-white/5">
                 <Button 
                    onClick={() => setShowRenameModal(true)} 
                    className="w-full h-14 rounded-2xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all"
                    disabled={status !== "READY" || isGenerating}
                 >
                    {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                    Generate .ZIP
                 </Button>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}