const API_BASE = "/api";

export interface TreeNode {
  name: string;
  is_dir: boolean;
  depth: number;
}

export interface ZipImportResponse {
  structure: string;
}

// Matches your report.py to_dict structure
export interface ParseReport {
  valid: boolean;
  message: string;
  fixes?: string[];
}

export interface PreviewResponse {
  nodes: TreeNode[];
  // Made optional because your current preview.py does not return it
  // but your parser generates it. Good for future-proofing.
  summary?: ParseReport; 
}

export const api = {
  // 🟢 Health Check
  checkHealth: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // 👀 Preview Structure
  // Maps to your preview.py: @router.post("")
  preview: async (structure: string): Promise<PreviewResponse> => {
    const res = await fetch(`${API_BASE}/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ structure }),
    });

    if (!res.ok) {
      // Handle the HTTPException(status_code=422) from your backend
      const errorData = await res.json();
      throw new Error(errorData.detail || `Preview failed: ${res.status}`);
    }

    return res.json();
  },

  // 📦 Generate ZIP
  // Maps to your generate.py: class GenerateRequest(BaseModel)
  generate: async (structure: string, name: string): Promise<Blob> => {
    const res = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ structure, name }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || `Generate failed: ${res.status}`);
    }

    return res.blob();
  },

  importZip: async (file: File): Promise<ZipImportResponse> => {
    const formData = new FormData();
    // CRITICAL: The key must be "file" exactly as per contract
    formData.append("file", file); 

    const response = await fetch(`${API_BASE}/import-zip`, {
      method: "POST",
      body: formData, // No headers needed, browser sets multipart/form-data automatically
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to parse ZIP file");
    }

    return response.json();
  },
};