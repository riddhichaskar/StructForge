"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// --- CORE IMPORTS ---
import { api, type PreviewResponse } from "@/lib/api";
import { buildTree, type UITreeNode } from "@/lib/tree-utils";
import { playSuccessSound } from "@/lib/sound-utils";

// --- UI COMPONENTS ---
import { AuroraBackground } from "@/components/background/AuroraBackground";
import { ErrorToast } from "@/components/ui/ErrorToast";
import { SystemStatus } from "@/components/ui/system-status";

// --- FEATURE COMPONENTS ---
import { ZipUploadZone } from "@/components/features/zip/ZipUploadZone";
import { StructurePreview } from "@/components/features/zip/StructurePreview";
import { TreeVisualizer } from "@/components/features/zip/TreeVisualizer";

export default function ZipToDirectoryPage() {
  // --- STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [structureText, setStructureText] = useState("");
  
  // Data
  const [rootNode, setRootNode] = useState<UITreeNode | null>(null);
  const [summary, setSummary] = useState<PreviewResponse["summary"] | null>(null);
  
  // UI Status
  const [status, setStatus] = useState<"IDLE" | "UPLOADING" | "ANALYZING" | "READY">("IDLE");
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- HEALTH CHECK ---
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthy = await api.checkHealth();
        setIsBackendOnline(healthy);
      } catch (e) { setIsBackendOnline(false); }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".zip")) {
        triggerError("Please upload a valid .zip file");
        return;
    }

    setFile(selectedFile);
    setStatus("UPLOADING");
    setErrorMessage(null);

    try {
        // 1. Upload & Extract
        const zipData = await api.importZip(selectedFile);
        const extractedText = zipData.structure;
        setStructureText(extractedText);

        // 2. Analyze & Build Tree
        setStatus("ANALYZING");
        const previewData = await api.preview(extractedText);
        
        const treeRoot = buildTree(previewData.nodes);
        setRootNode(treeRoot);
        setSummary(previewData.summary || null);
        setStatus("READY");
        playSuccessSound();

    } catch (error: any) {
        console.error(error);
        triggerError(error.message || "Failed to process ZIP file.");
        setStatus("IDLE");
        setFile(null);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setStructureText("");
    setRootNode(null);
    setStatus("IDLE");
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-700 ease-in-out">
      <AuroraBackground />
      <SystemStatus isOnline={isBackendOnline} />
      <ErrorToast message={errorMessage} onClose={() => setErrorMessage(null)} />

      <div className="relative z-10 pt-24 pb-20 px-6 max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="mb-12">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-4"
            >
              ZIP <span className="text-indigo-500">→</span> Directory
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-muted-foreground font-light max-w-2xl"
            >
              Upload a project archive to instantly generate its architecture tree.
            </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[750px]">
          
          {/* LEFT COLUMN: Upload / Preview */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col h-full bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden relative"
          >
             {status === "IDLE" || status === "UPLOADING" ? (
                 <ZipUploadZone status={status} onFileSelect={handleFileSelect} />
             ) : (
                 <StructurePreview 
                    fileName={file?.name || "archive.zip"} 
                    text={structureText} 
                    onReset={resetUpload}
                    onError={triggerError}
                 />
             )}
          </motion.div>

          {/* RIGHT COLUMN: Visualization */}
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="h-full"
          >
            <TreeVisualizer 
                status={status} 
                rootNode={rootNode} 
                summary={summary}
                fileName={file?.name || null}
                onError={triggerError}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}