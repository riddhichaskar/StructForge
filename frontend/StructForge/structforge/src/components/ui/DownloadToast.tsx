"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, X } from "lucide-react";

interface DownloadToastProps {
  open: boolean;
  onClose: () => void;
}

export function DownloadToast({ open, onClose }: DownloadToastProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-foreground text-background px-6 py-4 rounded-full shadow-2xl"
        >
            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <FileDown className="h-5 w-5 text-white" />
            </div>
            <div>
                <h4 className="font-bold text-sm">Download Started</h4>
                <p className="text-xs opacity-80">Your ZIP file has been exported.</p>
            </div>
            <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100">
                <X className="h-4 w-4" />
            </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}