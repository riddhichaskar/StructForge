"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

interface ZipUploadZoneProps {
  status: "IDLE" | "UPLOADING" | "ANALYZING" | "READY";
  onFileSelect: (file: File) => void;
}

export function ZipUploadZone({ status, onFileSelect }: ZipUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed transition-all duration-300 cursor-pointer h-full min-h-[400px]
          ${isDragOver ? "border-indigo-500 bg-indigo-500/10" : "border-muted-foreground/20 hover:border-indigo-500/50 hover:bg-white/5"}
      `}
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".zip" 
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} 
      />

      <div className="h-24 w-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
          {status === "UPLOADING" ? (
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          ) : (
              <UploadCloud className="h-10 w-10 text-indigo-500" />
          )}
      </div>
      
      <h3 className="text-2xl font-bold mb-2">
          {status === "UPLOADING" ? "Uploading & Extracting..." : "Upload ZIP File"}
      </h3>
      <p className="text-muted-foreground text-center max-w-sm">
          Drag & drop your archive here, or click to browse.
          <br/><span className="text-xs opacity-70">Max size 10MB</span>
      </p>
    </div>
  );
}