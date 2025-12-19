"use client";

import { useState } from "react";
import { FileArchive, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StructurePreviewProps {
  fileName: string;
  text: string;
  onReset: () => void;
  onError: (msg: string) => void;
}

export function StructurePreview({ fileName, text, onReset, onError }: StructurePreviewProps) {
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (e) {
      onError("Failed to copy text to clipboard.");
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300">
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <FileArchive className="w-5 h-5 text-indigo-500" />
              <span className="font-bold truncate max-w-[200px]">{fileName}</span>
          </div>
          
          <div className="flex gap-2">
              <Button 
                  variant="ghost" size="sm" 
                  onClick={handleCopy} 
                  className="hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors"
              >
                  {isCopying ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {isCopying ? "Copied" : "Copy"}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onReset} className="hover:bg-red-500/10 hover:text-red-500">
                  <X className="w-4 h-4 mr-2" /> New
              </Button>
          </div>
      </div>
      
      <div className="flex-1 relative group">
          <textarea
              value={text}
              readOnly
              className="absolute inset-0 w-full h-full bg-transparent p-6 font-mono text-base resize-none focus:outline-none text-foreground/90 leading-relaxed"
          />
      </div>
    </div>
  );
}