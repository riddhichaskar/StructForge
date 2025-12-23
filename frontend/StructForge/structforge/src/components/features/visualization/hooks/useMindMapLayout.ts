import { useEffect } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  Position, 
  type Node, 
  type Edge 
} from '@xyflow/react';
import dagre from 'dagre';
import type { FileNode } from '@/types/structure';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

// Helper to flatten recursive structure
const generateElements = (data: FileNode, parentId: string | null = null, nodes: Node[] = [], edges: Edge[] = []) => {
  const id = parentId ? `${parentId}-${data.name}` : 'root';
  
  // Create Node
  nodes.push({
    id,
    type: 'mindMap', // Changed from 'custom' to match what we will register later
    data: { label: data.name, type: data.type },
    position: { x: 0, y: 0 }, 
  });

  // Create Edge
  if (parentId) {
    edges.push({
      id: `${parentId}-${id}`,
      source: parentId,
      target: id,
      type: 'smoothstep',
      animated: false,
    });
  }

  // Recurse
  if (data.children) {
    data.children.forEach((child) => generateElements(child, id, nodes, edges));
  }

  return { nodes, edges };
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: direction === 'LR' ? Position.Left : Position.Top,
      sourcePosition: direction === 'LR' ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const useMindMapLayout = (data: FileNode | null) => {
  // FIXED: Added <Node> and <Edge> generics so TS knows this isn't always empty
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (!data) return;

    const { nodes: initialNodes, edges: initialEdges } = generateElements(data);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      'LR'
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [data, setNodes, setEdges]);

  return { nodes, edges, onNodesChange, onEdgesChange };
};