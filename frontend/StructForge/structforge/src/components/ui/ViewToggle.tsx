import { motion } from 'framer-motion';
import { LayoutPanelLeft, Rows2 } from 'lucide-react'; // Icons representing Layouts

interface ViewToggleProps {
  mode: 'vertical' | 'horizontal';
  setMode: (mode: 'vertical' | 'horizontal') => void;
}

export const ViewToggle = ({ mode, setMode }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
      <button
        onClick={() => setMode('vertical')}
        className={`p-2 rounded-md transition-colors ${mode === 'vertical' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        title="Vertical Layout"
      >
        {/* Custom Icon: Box with Vertical Line on Right */}
        <div className="w-5 h-5 border-2 border-current rounded flex">
           <div className="w-2/3 h-full border-r-2 border-current"></div>
        </div>
      </button>

      <button
        onClick={() => setMode('horizontal')}
        className={`p-2 rounded-md transition-colors ${mode === 'horizontal' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        title="Horizontal Layout"
      >
         {/* Custom Icon: Box with Horizontal Line */}
         <div className="w-5 h-5 border-2 border-current rounded flex flex-col">
            <div className="h-2/3 w-full border-b-2 border-current"></div>
         </div>
      </button>
    </div>
  );
};