import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { File, Folder, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils'; 

// 1. Define the shape of your custom data
export type MindMapNodeData = {
  label: string;
  type: 'file' | 'folder';
  isCollapsed?: boolean;
  hasChildren?: boolean;
  onToggle?: (id: string) => void;
};

// 2. Define the Node type by extending the base Node
// 'mindMap' is the type string used in nodeTypes
export type MindMapNodeType = Node<MindMapNodeData, 'mindMap'>;

// 3. Use the full Node type in NodeProps
const MindMapNode = ({ id, data }: NodeProps<MindMapNodeType>) => {
  return (
    <div className={cn(
      "relative px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2 min-w-[150px] transition-all group",
      data.type === 'folder' ? "bg-teal-50 border-teal-200 text-teal-800" : "bg-white text-slate-700"
    )}>
      {/* Input Handle */}
      <Handle type="target" position={Position.Left} className="!bg-teal-400 !w-2 !h-2" />
      
      {/* Icon */}
      {data.type === 'folder' ? <Folder size={16} /> : <File size={16} />}
      
      {/* Label */}
      <span className="text-sm font-medium truncate pr-2">{data.label}</span>

      {/* Collapse/Expand Button */}
      {data.hasChildren && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            data.onToggle?.(id);
          }}
          className="ml-auto p-0.5 rounded-full hover:bg-teal-200/50 text-teal-600 transition-colors"
        >
          {data.isCollapsed ? (
            <ChevronRight size={14} /> 
          ) : (
            <ChevronLeft size={14} /> 
          )}
        </button>
      )}

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} className="!bg-teal-400 !w-2 !h-2" />
    </div>
  );
};

export default memo(MindMapNode);