// src/components/ui/file-tree.tsx

import { useState } from "react";
import { Folder, FolderOpen, File, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { UITreeNode } from "@/lib/tree-utils";

interface FileTreeProps {
  root: UITreeNode | null;
}

export function FileTree({ root }: FileTreeProps) {
  if (!root) return null;

  return (
    <div className="font-mono text-sm select-none">
      <TreeNodeItem node={root} />
    </div>
  );
}

function TreeNodeItem({ node }: { node: UITreeNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  // Toggle handler only for directories
  const handleClick = () => {
    if (node.is_dir) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="ml-4">
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 py-1 px-2 rounded-md transition-colors",
          "hover:bg-accent/50 text-foreground/80 hover:text-foreground",
          node.is_dir ? "cursor-pointer" : "cursor-default"
        )}
      >
        {/* Chevron for Folders */}
        <div className="w-4 h-4 flex items-center justify-center">
          {node.is_dir && (
            isOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
        </div>

        {/* Folder/File Icon */}
        {node.is_dir ? (
          isOpen ? (
            <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          ) : (
            <Folder className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          )
        ) : (
          <File className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        )}

        {/* Node Name */}
        <span className={cn(node.is_dir ? "font-semibold" : "font-normal")}>
          {node.name}
        </span>
      </div>

      {/* Recursive Children Rendering */}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-l border-border/40 ml-4"
          >
            {node.children.map((child, index) => (
              <TreeNodeItem key={`${child.name}-${index}`} node={child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}