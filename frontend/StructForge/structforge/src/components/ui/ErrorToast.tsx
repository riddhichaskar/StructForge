"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ErrorToastProps {
  message: string | null;
  onClose: () => void;
}

export function ErrorToast({ message, onClose }: ErrorToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[60] flex items-center gap-4 bg-destructive text-destructive-foreground px-6 py-4 rounded-full shadow-2xl border border-red-500/20"
        >
            <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center shrink-0 border border-red-400/30">
                <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
                <h4 className="font-bold text-sm text-white">Error</h4>
                <p className="text-xs text-white/90">{message}</p>
            </div>
            <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-white">
                <X className="h-4 w-4" />
            </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}