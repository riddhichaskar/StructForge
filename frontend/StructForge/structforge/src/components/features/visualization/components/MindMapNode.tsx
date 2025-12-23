import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { File, Folder } from 'lucide-react';
import { cn } from '../../../../lib/utils'; // Fixed path depth if needed

const MindMapNode = ({ data }: { data: { label: string; type: 'file' | 'folder' } }) => {
  return (
    <div className={cn(
      "px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2 min-w-[150px] transition-all",
      data.type === 'folder' ? "bg-teal-50 border-teal-200 text-teal-800" : "bg-white text-slate-700"
    )}>
      {/* Input Handle (Left) */}
      <Handle type="target" position={Position.Left} className="!bg-teal-400 !w-2 !h-2" />
      
      {/* Icon */}
      {data.type === 'folder' ? <Folder size={16} /> : <File size={16} />}
      
      {/* Text */}
      <span className="text-sm font-medium truncate">{data.label}</span>

      {/* Output Handle (Right) */}
      <Handle type="source" position={Position.Right} className="!bg-teal-400 !w-2 !h-2" />
    </div>
  );
};

export default memo(MindMapNode);