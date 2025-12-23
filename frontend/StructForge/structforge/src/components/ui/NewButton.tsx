import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface NewButtonProps {
  onClick: () => void;
  className?: string;
}

export const NewButton = ({ onClick, className = '' }: NewButtonProps) => {
  return (
    <motion.button
      initial="collapsed"
      whileHover="expanded"
      className={`flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg overflow-hidden ${className}`}
      onClick={onClick}
      layout
    >
      <motion.div className="p-3">
        <Plus size={24} />
      </motion.div>
      <motion.span
        variants={{
          collapsed: { width: 0, opacity: 0 },
          expanded: { width: 'auto', opacity: 1, paddingRight: '12px' }
        }}
        className="font-medium whitespace-nowrap"
      >
        New Project
      </motion.span>
    </motion.button>
  );
};