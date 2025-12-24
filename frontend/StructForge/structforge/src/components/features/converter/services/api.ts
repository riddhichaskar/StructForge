//src/components/features/converter/services/api.ts
import type { FileNode } from "@/types/structure";

const API_URL = "http://localhost:8000"; // Adjust port if needed

// 1. Define the exact shape of your Backend Response
interface BackendNode {
  name: string;
  is_dir: boolean;
  depth: number;
}

interface ImportZipResponse {
  nodes: BackendNode[];
  text: string;
  summary: {
    valid: boolean;
    fixes: string[];
    warnings: string[];
  };
}

// 2. The Frontend needs a Tree for React Flow, but Backend gives a Flat List.
// We need a small helper to convert Flat List (DFS ordered) -> Recursive Tree.
const convertFlatToTree = (flatNodes: BackendNode[], rootName: string): FileNode => {
  const root: FileNode = { name: rootName, type: 'folder', children: [] };
  const stack: { node: FileNode; depth: number }[] = [{ node: root, depth: -1 }];

  flatNodes.forEach((flatNode) => {
    const newNode: FileNode = {
      name: flatNode.name,
      type: flatNode.is_dir ? 'folder' : 'file',
      children: flatNode.is_dir ? [] : undefined,
    };

    // Pop stack until we find the parent (parent depth must be < current depth)
    while (stack.length > 0 && stack[stack.length - 1].depth >= flatNode.depth) {
      stack.pop();
    }

    // Add to parent
    const parent = stack[stack.length - 1].node;
    if (parent.children) {
      parent.children.push(newNode);
    }

    // Push new node to stack if it's a directory (it might have children)
    if (flatNode.is_dir) {
      stack.push({ node: newNode, depth: flatNode.depth });
    }
  });

  return root;
};

// 3. The API Call
export const importZip = async (file: File): Promise<{ tree: FileNode; text: string }> => {
  const formData = new FormData();
  formData.append("file", file); // Exact key from your contract

  try {
    const response = await fetch(`${API_URL}/import-zip`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data: ImportZipResponse = await response.json();

    // Transform Backend Data -> Frontend UI format
    return {
      tree: convertFlatToTree(data.nodes, file.name),
      text: data.text,
    };

  } catch (error) {
    console.error("Import Zip API Error:", error);
    throw error;
  }
};