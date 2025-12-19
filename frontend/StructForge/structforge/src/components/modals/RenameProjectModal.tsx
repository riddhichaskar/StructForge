"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { AnimatedSparkle } from "@/components/ui/AnimatedSparkle";

interface RenameProjectModalProps {
  open: boolean;
  projectName: string;
  onProjectNameChange: (val: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RenameProjectModal({ 
  open, 
  projectName, 
  onProjectNameChange, 
  onCancel, 
  onConfirm 
}: RenameProjectModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AnimatedSparkle /> 
              <span className="ml-[-1.5rem]">Ready to Export</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Confirm your project name before generating the ZIP file.
            </p>
            
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block pl-1">
                Project Name
              </label>
              <div className="relative">
                  <input 
                    value={projectName}
                    onChange={(e) => onProjectNameChange(e.target.value)}
                    className="w-full bg-muted/50 border-2 border-transparent focus:border-indigo-500 rounded-xl px-4 py-3 text-lg font-medium outline-none transition-all"
                    autoFocus
                  />
                  <Edit3 className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground opacity-50" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 rounded-xl h-12 text-base" onClick={onCancel}>
                  Cancel
              </Button>
              <Button 
                  className="flex-1 rounded-xl h-12 text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                  onClick={onConfirm}
              >
                  Download .ZIP
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}