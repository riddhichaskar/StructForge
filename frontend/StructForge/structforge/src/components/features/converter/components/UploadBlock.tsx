import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, FileText, Upload } from 'lucide-react';
import { NewButton } from '@/components/ui/NewButton';
import { cn } from '@/lib/utils';

interface UploadBlockProps {
  mode: 'vertical' | 'horizontal';
  fileName: string | null;
  textContent: string;
  onUpload: (file: File) => void;
  onReset: () => void;
}

export const UploadBlock = ({ mode, fileName, textContent, onUpload, onReset }: UploadBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // ----------------------------------------------------------------------
  // COMMON: Upload Zone UI
  // ----------------------------------------------------------------------
  const renderUploadZone = () => (
    <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer group relative overflow-hidden",
            // Ensure drag colors look good in dark mode too
            isDragging ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20" : "border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/50",
            mode === 'horizontal' ? "h-full min-h-[400px] rounded-xl" : "h-[200px] w-full rounded-2xl"
        )}
    >
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".zip"
        />

        <div className="z-10 flex flex-col items-center gap-3 text-center p-6">
            <div className={cn(
                "p-4 rounded-full transition-colors",
                isDragging ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500 dark:group-hover:text-blue-400"
            )}>
                <Upload size={mode === 'horizontal' ? 32 : 24} />
            </div>
            <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {isDragging ? "Drop zip here" : "Click to upload or drag & drop"}
                </p>
                <p className="text-sm text-slate-400 mt-1">.zip files only</p>
            </div>
        </div>

        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );


  // ----------------------------------------------------------------------
  // VIEW: Horizontal (Standard Side-by-Side)
  // ----------------------------------------------------------------------
  if (mode === 'horizontal') {
    return (
      // OUTER CONTAINER: Added dark:bg-slate-900/90 and dark:border-slate-800
      <div className="h-full flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden relative p-6 transition-colors">
        {!fileName ? (
            renderUploadZone()
        ) : (
            <>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <FileText size={20} className="text-blue-500"/>
                        Text Structure
                    </h3>
                    <div className="flex gap-2">
                         <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                            title="Copy Text"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                </div>

                {/* INNER TEXT AREA: Added dark:bg-slate-950/50, dark:text-slate-300, and dark:border-slate-800 */}
                <div className="flex-1 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl p-4 overflow-auto font-mono text-sm text-slate-600 dark:text-slate-300 whitespace-pre border border-slate-100 dark:border-slate-800 custom-scrollbar">
                  {textContent}
                </div>

                <div className="absolute bottom-6 right-6">
                  <NewButton onClick={onReset} />
                </div>
            </>
        )}
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW: Vertical (Collapsible Stack)
  // ----------------------------------------------------------------------

  // STATE 1: No File -> Show Compact Dropzone
  if (!fileName) {
      return (
          <div className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-2 transition-colors">
              {renderUploadZone()}
          </div>
      );
  }

  // STATE 2: File Uploaded -> Collapsible Bar
  return (
    <motion.div
      layout
      className={cn(
        "w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden relative transition-all",
        isExpanded ? "min-h-[400px]" : "h-auto"
      )}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/50 border-b border-transparent data-[expanded=true]:border-slate-100 dark:data-[expanded=true]:border-slate-800" data-expanded={isExpanded}>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <FileText size={20} />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-200">{fileName}</span>
        </div>

        <div className="flex items-center gap-2">
            {!isExpanded && (
                 <NewButton onClick={onReset} className="scale-75 origin-right" />
            )}

            <button
                onClick={toggleExpand}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
            >
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
        </div>
      </div>

      {/* Expanded Content Area */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-0"
          >
             <div className="relative p-6 pt-2">
                <div className="flex justify-end mb-2">
                     <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <Copy size={14} /> Copy Structure
                    </button>
                </div>

                <div className="h-64 bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 overflow-auto font-mono text-sm text-slate-600 dark:text-slate-300 whitespace-pre border border-slate-100 dark:border-slate-800 custom-scrollbar">
                    {textContent}
                </div>

                <div className="absolute bottom-6 right-6 translate-y-2">
                    <NewButton onClick={onReset} />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};