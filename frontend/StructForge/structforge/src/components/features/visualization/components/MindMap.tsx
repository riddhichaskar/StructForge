import { useCallback, useRef } from 'react';
import { ReactFlow, Controls, Background, useReactFlow, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

import { useMindMapLayout } from '../hooks/useMindMapLayout';
import MindMapNode from './MindMapNode';
import type { FileNode } from '@/types/structure';

// Register our custom node types
const nodeTypes = {
  mindMap: MindMapNode,
};

interface MindMapProps {
  data: FileNode | null;
}

export const MindMap = ({ data }: MindMapProps) => {
  const { nodes, edges, onNodesChange, onEdgesChange } = useMindMapLayout(data);
  const ref = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();

  const downloadImage = useCallback(() => {
    if (ref.current === null) return;

    toPng(ref.current, { cacheBust: true, backgroundColor: '#ffffff' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'mindmap.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to download image', err);
      });
  }, [ref]);

  if (!data) return <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed rounded-xl">No structure to visualize</div>;

  return (
    <div className="w-full h-[500px] border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 relative group">
      {/* The Graph Container */}
      <div className="w-full h-full" ref={ref}>
        <ReactFlow
          nodes={nodes}
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

      {/* Download Button (Top Right absolute) */}
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