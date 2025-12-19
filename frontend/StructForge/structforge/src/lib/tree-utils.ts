// src/lib/tree-utils.ts

import type { TreeNode } from "./api";

export interface UITreeNode extends TreeNode {
  children: UITreeNode[];
}

/**
 * Converts a flat list of nodes (guaranteed by backend to be sorted)
 * into a nested tree structure.
 */
export function buildTree(nodes: TreeNode[]): UITreeNode | null {
  if (!nodes || nodes.length === 0) return null;

  // Initialize root with children array
  const root: UITreeNode = { ...nodes[0], children: [] };
  const stack: UITreeNode[] = [root];

  for (let i = 1; i < nodes.length; i++) {
    const node: UITreeNode = { ...nodes[i], children: [] };

    // Adjust stack to the correct parent depth
    // Parent depth must be strictly less than current node depth
    while (stack.length > node.depth) {
      stack.pop();
    }

    // Add current node to the parent found at the top of the stack
    const parent = stack[stack.length - 1];
    if (parent) {
      parent.children.push(node);
    }
    
    stack.push(node);
  }

  return root;
}