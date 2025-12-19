"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export function TypewriterLoader({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState("");
  const fullText = "Analyzing structure syntax...";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-primary">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      <span className="font-mono text-lg font-medium tracking-tight">
        {text}<span className="animate-pulse">_</span>
      </span>
    </div>
  );
}