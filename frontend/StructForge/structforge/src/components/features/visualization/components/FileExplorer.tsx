import { useState, useRef, useCallback } from 'react';
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen, Download } from 'lucide-react';
import type { FileNode } from '@/types/structure';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { toPng } from 'html-to-image';

// --- Recursive Item Component ---
const FileTreeItem = ({ node, depth = 0 }: { node: FileNode; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(depth === 0); // Open root by default
  const hasChildren = node.children && node.children.length > 0;
  const isFolder = node.type === 'folder';

  const toggleOpen = () => {
    if (isFolder) setIsOpen(!isOpen);
  };

  return (
    <div className="select-none text-left">
      <div 
        onClick={toggleOpen}
        style={{ paddingLeft: `${depth * 20}px` }}
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors rounded-md",
          "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
          !isFolder && "cursor-default text-slate-600 dark:text-slate-400"
        )}
      >
        <span className="w-4 h-4 flex items-center justify-center shrink-0 text-slate-400">
          {isFolder && (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
        </span>

        <span className={cn("shrink-0", isFolder ? "text-blue-500" : "text-slate-500")}>
          {isFolder ? (
            isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
          ) : (
            <FileCode size={16} />
          )}
        </span>

        <span className="text-sm font-medium truncate">{node.name}</span>
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children!.map((child, i) => (
              <FileTreeItem key={`${child.name}-${i}`} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Container Component ---
export const FileExplorer = ({ data }: { data: FileNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const downloadImage = useCallback(() => {
    if (ref.current === null) return;

    // We set a dark background for the PNG so it looks good when saved
    toPng(ref.current, { cacheBust: true, backgroundColor: '#0f172a' }) 
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'file-structure.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to download image', err);
      });
  }, [ref]);

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[300px] flex flex-col transition-colors relative group">
      
      {/* Header with Title & Download Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200">
          File Explorer
        </h3>
        
        <button
          onClick={downloadImage}
          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 transition-colors"
        >
          <Download size={14} />
          PNG
        </button>
      </div>

      {/* Scrollable Tree Container */}
      <div 
        ref={ref}
        className="flex-1 bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar"
      >
        <FileTreeItem node={data} />
      </div>
    </div>
  );
};