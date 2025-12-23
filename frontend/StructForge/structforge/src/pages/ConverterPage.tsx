import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';

// Components
import { ViewToggle } from '../components/ui/ViewToggle';
import { UploadBlock } from '@/components/features/converter/components/UploadBlock';
import { MindMap } from '@/components/features/visualization/components/MindMap';
// Types
import type { FileNode } from '../types/structure';

// MOCK DATA (Move this to a separate data file later if needed)
const MOCK_DATA: FileNode = {
  name: 'project-root',
  type: 'folder',
  children: [
    { name: 'src', type: 'folder', children: [
        { name: 'components', type: 'folder', children: [] },
        { name: 'App.tsx', type: 'file' },
        { name: 'index.css', type: 'file' }
    ]},
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' }
  ]
};

const MOCK_TEXT = `project-root/
├── src/
│   ├── components/
│   ├── App.tsx
│   └── index.css
├── package.json
└── README.md`;

export const ConverterPage = () => {
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [fileData, setFileData] = useState<FileNode | null>(MOCK_DATA);
  const [fileName, setFileName] = useState<string | null>("example-project.zip");

  const handleReset = () => {
    setFileData(null);
    setFileName(null);
  };

  const handleUpload = () => {
    // Logic to parse file would go here
    setFileData(MOCK_DATA);
    setFileName("new-upload.zip");
  };

  return (
    <ReactFlowProvider>
      <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
        
        {/* Header */}
        <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <h1 className="text-2xl font-bold tracking-tight text-slate-900">
               Zip <span className="text-slate-400">→</span> Text
             </h1>
             <ViewToggle mode={layoutMode} setMode={setLayoutMode} />
          </div>
        </header>

        {/* Main Content Grid */}
        <main className={`max-w-7xl mx-auto grid gap-6 ${
          layoutMode === 'horizontal' 
            ? 'grid-cols-2 h-[80vh]' 
            : 'grid-cols-1 auto-rows-min'
        }`}>
          
          {/* 1. INPUT SECTION */}
          <section className={layoutMode === 'horizontal' ? 'h-full' : 'w-full'}>
             <UploadBlock 
                mode={layoutMode} 
                fileName={fileName}
                textContent={MOCK_TEXT}
                onUpload={handleUpload}
                onReset={handleReset}
             />
          </section>

          {/* 2. PREVIEW SECTION */}
          <section className={`flex flex-col gap-6 ${layoutMode === 'horizontal' ? 'h-full overflow-y-auto' : ''}`}>
             
             {/* Visualization A: Standard Tree */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[300px]">
                <h3 className="font-semibold mb-4 text-slate-700">Tree View</h3>
                <pre className="text-sm font-mono text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 overflow-x-auto">
                    {MOCK_TEXT}
                </pre>
             </div>

             {/* Visualization B: Mind Map */}
             {fileData && (
                 <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-slate-700 px-1">Visual Map</h3>
                    <MindMap data={fileData} />
                 </div>
             )}
          </section>

        </main>
      </div>
    </ReactFlowProvider>
  );
};