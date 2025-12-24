import { X, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GuideDrawerProps {
  title: string;
  children: React.ReactNode;
}

export const GuideDrawer = ({ title, children }: GuideDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
      >
        <HelpCircle size={16} />
        <span>Guide</span>
      </button>

      {/* Backdrop - Set to 9998 to be just under the panel */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[9998] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Panel - Set to 9999 to force it on TOP of everything */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out p-6",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          {children}
        </div>
      </div>
    </>
  );
};