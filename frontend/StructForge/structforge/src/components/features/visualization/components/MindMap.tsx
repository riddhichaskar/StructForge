import { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { ReactFlow, Controls, Background, type Edge, type NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

import { useMindMapLayout } from '../hooks/useMindMapLayout';
import MindMapNode, { type MindMapNodeType } from './MindMapNode';
import type { FileNode } from '@/types/structure';

// 1. Explicitly type the nodeTypes object
const nodeTypes: NodeTypes = {
  mindMap: MindMapNode,
};

interface MindMapProps {
  data: FileNode | null;
}

const getDescendants = (nodeId: string, edges: Edge[]): string[] => {
  const children = edges.filter(e => e.source === nodeId).map(e => e.target);
  let descendants = [...children];
  children.forEach(child => {
    descendants = [...descendants, ...getDescendants(child, edges)];
  });
  return descendants;
};

export const MindMap = ({ data }: MindMapProps) => {
  const { nodes: layoutNodes, edges, onNodesChange, onEdgesChange } = useMindMapLayout(data);
  const ref = useRef<HTMLDivElement>(null);
  
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  // --- NEW: Collapse by Default Effect ---
  useEffect(() => {
    if (!data || layoutNodes.length === 0) return;

    const allParentIds = new Set<string>();
    const allTargetIds = new Set<string>();

    // 1. Find all nodes that are parents (sources) and children (targets)
    edges.forEach(edge => {
        allParentIds.add(edge.source);
        allTargetIds.add(edge.target);
    });

    // 2. Find the Root (The one node that is never a target)
    const rootNode = layoutNodes.find(n => !allTargetIds.has(n.id));

    // 3. Expand ONLY the root. Collapse everything else.
    if (rootNode) {
        allParentIds.delete(rootNode.id);
    }

    setCollapsedIds(allParentIds);
  }, [data]); // Only run when the source data changes
  // ---------------------------------------

  const onToggle = useCallback((id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const visibleNodes = useMemo(() => {
    const hiddenNodeIds = new Set<string>();
    
    collapsedIds.forEach(parentId => {
      const descendants = getDescendants(parentId, edges);
      descendants.forEach(id => hiddenNodeIds.add(id));
    });

    return layoutNodes.map((node) => {
      const hasChildren = edges.some(e => e.source === node.id);

      // Force casting to MindMapNodeType is safe here because we control the data shape
      const customNode: MindMapNodeType = {
        ...node,
        id: node.id,
        position: node.position,
        type: 'mindMap', 
        hidden: hiddenNodeIds.has(node.id),
        data: {
          label: (node.data.label as string) || '', 
          type: (node.data.type as 'file'|'folder') || 'file',
          isCollapsed: collapsedIds.has(node.id),
          hasChildren: hasChildren,
          onToggle: onToggle,
        },
      };
      return customNode;
    });
  }, [layoutNodes, edges, collapsedIds, onToggle]);

  const downloadImage = useCallback(() => {
    if (ref.current === null) return;
    toPng(ref.current, { cacheBust: true, backgroundColor: '#ffffff' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'mindmap.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Failed to download image', err));
  }, [ref]);

  if (!data) return <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed rounded-xl">No structure to visualize</div>;

  return (
    <div className="w-full h-[500px] border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 relative group">
      <div className="w-full h-full" ref={ref}>
        <ReactFlow<MindMapNodeType> 
          nodes={visibleNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-50"
          minZoom={0.5}
          maxZoom={2}
        >
          <Background color="#e2e8f0" gap={20} />
          <Controls className="!bg-white !shadow-sm !border-slate-200 !text-slate-600" />
        </ReactFlow>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={downloadImage}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
        >
          <Download size={16} />
          PNG
        </button>
      </div>
    </div>
  );
};