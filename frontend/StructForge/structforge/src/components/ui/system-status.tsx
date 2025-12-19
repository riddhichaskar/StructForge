"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemStatusProps {
  isOnline: boolean;
}

export function SystemStatus({ isOnline }: SystemStatusProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-collapse logic
  useEffect(() => {
    setIsExpanded(true);
    const timer = setTimeout(() => setIsExpanded(false), 3000);
    return () => clearTimeout(timer);
  }, [isOnline]);

  return (
    <div 
      className="fixed right-0 top-32 z-50 flex items-center justify-end"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <motion.div
        // Animate X position: 0 = Fully visible, "calc(100% - 60px)" = Only icon visible
        initial={{ x: "calc(100% - 60px)" }}
        animate={{ x: isExpanded ? 0 : "calc(100% - 60px)" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "flex items-center gap-4 pl-5 pr-8 py-4 rounded-l-full shadow-xl cursor-pointer transition-colors duration-300",
          "text-white font-bold tracking-wide", // Force White Text
          isOnline ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"
        )}
      >
        <div className="relative shrink-0 flex items-center justify-center">
          {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
          
          {/* Ping Animation for Online Status */}
          {isOnline && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          )}
        </div>
        
        {/* Text Container - Flex column for alignment */}
        <div className="flex flex-col whitespace-nowrap min-w-[120px]">
          <span className="text-[10px] uppercase opacity-80 leading-none mb-1">
            System Status
          </span>
          <span className="text-base leading-none">
            {isOnline ? "Operational" : "Offline"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}