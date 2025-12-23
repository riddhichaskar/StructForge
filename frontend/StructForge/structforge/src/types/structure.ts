export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

export type LayoutMode = 'vertical' | 'horizontal';