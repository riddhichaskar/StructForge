import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';

// --- COMPONENTS ---
import { ViewToggle } from '../components/ui/ViewToggle';
import { UploadBlock } from '@/components/features/converter/components/UploadBlock';
import { MindMap } from '@/components/features/visualization/components/MindMap';
import { FileExplorer } from '@/components/features/visualization/components/FileExplorer'; 
import { AuroraBackground } from '@/components/background/AuroraBackground';

// --- SERVICES & TYPES ---
import { importZip } from '@/components/features/converter/services/api';
import type { FileNode } from '@/types/structure';

const ZipToDirectoryPage = () => {
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  
  const [fileData, setFileData] = useState<FileNode | null>(null); 
  const [fileName, setFileName] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>("");     
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReset = () => {
    setFileData(null);
    setFileName(null);
    setTextContent("");
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
        setFileName(file.name);
        const result = await importZip(file);
        
        setFileData(result.tree); 
        setTextContent(result.text); 

    } catch (error) {
        console.error("Failed to process zip:", error);
        alert("Error processing zip file. Please ensure the backend server is running.");
        handleReset();
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <ReactFlowProvider>
      <div className="relative min-h-[calc(100vh-80px)] w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
        
        {/* BACKGROUND */}
        <AuroraBackground />
        
        {/* CONTENT */}
        <div className="relative z-10 p-6 font-sans text-slate-800 dark:text-slate-200">
          
          {/* HEADER */}
          <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Zip <span className="text-slate-400">→</span> Directory
              </h1>
              <ViewToggle mode={layoutMode} setMode={setLayoutMode} />
            </div>
          </header>

          {/* MAIN GRID */}
          <main className={`max-w-7xl mx-auto grid gap-6 ${
            layoutMode === 'horizontal' 
              ? 'grid-cols-2 h-[80vh]' 
              : 'grid-cols-1 auto-rows-min'
          }`}>
            
            {/* INPUT SECTION */}
            <section className={layoutMode === 'horizontal' ? 'h-full' : 'w-full'}>
              <UploadBlock 
                  mode={layoutMode} 
                  fileName={fileName}
                  textContent={textContent} 
                  onUpload={handleUpload}
                  onReset={handleReset}
              />
              {isProcessing && (
                <p className="text-center mt-4 text-sm font-medium text-blue-500 animate-pulse">
                  Processing zip structure...
                </p>
              )}
            </section>

            {/* PREVIEW SECTION */}
            <section className={`flex flex-col gap-6 ${layoutMode === 'horizontal' ? 'h-full overflow-y-auto' : ''}`}>
              
              {/* FILE EXPLORER: NO OUTER WRAPPER NOW! */}
              {fileData && (
                 <FileExplorer data={fileData} />
              )}

              {/* MIND MAP (Vertical Only) */}
              {fileData && layoutMode === 'vertical' && (
                  <div className="flex flex-col gap-2 mt-4">
                      <h3 className="font-semibold text-slate-700 px-1 dark:text-slate-200">
                        Visual Map
                      </h3>
                      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[500px] transition-colors">
                        <MindMap data={fileData} />
                      </div>
                  </div>
              )}

            </section>

          </main>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default ZipToDirectoryPage;