import { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';

// --- UI COMPONENTS ---
import { ViewToggle } from '../components/ui/ViewToggle';
import { UploadBlock } from '@/components/features/converter/components/UploadBlock';
import { MindMap } from '@/components/features/visualization/components/MindMap';
import { FileExplorer } from '@/components/features/visualization/components/FileExplorer'; 
import { AuroraBackground } from '@/components/background/AuroraBackground';
import { SystemStatus } from '@/components/ui/system-status'; 
import { ErrorToast } from '@/components/ui/ErrorToast'; 
import { ZipToDirGuide } from '@/components/features/guides/ZipToDirGuide';

// --- SERVICES & TYPES ---
import { api as systemApi } from "@/lib/api"; 
import { importZip } from "@/components/features/converter/services/api";
import type { FileNode } from '@/types/structure';

const ZipToDirectoryPage = () => {
  // --- LAYOUT & DATA STATE ---
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [fileData, setFileData] = useState<FileNode | null>(null); 
  const [fileName, setFileName] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>("");     
  const [isProcessing, setIsProcessing] = useState(false);
  
  // --- SYSTEM STATUS STATE ---
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- HEALTH CHECK POLLING ---
  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Using the generic lib API for health checks
        const healthy = await systemApi.checkHealth();
        setIsBackendOnline(healthy);
      } catch (e) {
        setIsBackendOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- HELPER: Error Trigger ---
  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // --- HANDLERS ---
  const handleReset = () => {
    setFileData(null);
    setFileName(null);
    setTextContent("");
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    
    if (!isBackendOnline) {
      triggerError("Backend is offline. Please start the server.");
      return;
    }

    setIsProcessing(true);
    try {
        setFileName(file.name);
        
        // 1. Call API using the feature-specific service
        // This service now handles the complex parsing (flat list -> tree) for us!
        const { tree, text } = await importZip(file);
        
        // 2. Set State directly
        setTextContent(text); 
        setFileData(tree);

    } catch (error: any) {
        console.error("Failed to process zip:", error);
        triggerError(error.message || "Failed to process zip file. Please check input.");
        handleReset();
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <ReactFlowProvider>
      <div className="relative min-h-[calc(100vh-80px)] w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
        
        <AuroraBackground />
        <SystemStatus isOnline={isBackendOnline} />
        <ErrorToast message={errorMessage} onClose={() => setErrorMessage(null)} />

        <div className="relative z-10 p-6 font-sans text-slate-800 dark:text-slate-200">
          
          <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Zip <span className="text-slate-400">→</span> Directory
              </h1>
              <ZipToDirGuide />
              <ViewToggle mode={layoutMode} setMode={setLayoutMode} />
            </div>
          </header>

          <main className={`max-w-7xl mx-auto grid gap-6 ${
            layoutMode === 'horizontal' 
              ? 'grid-cols-2 h-[80vh]' 
              : 'grid-cols-1 auto-rows-min'
          }`}>
            
            {/* Input Section */}
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

            {/* Preview Section */}
            <section className={`flex flex-col gap-6 ${layoutMode === 'horizontal' ? 'h-full overflow-y-auto' : ''}`}>
              
              {fileData && (
                 <FileExplorer data={fileData} />
              )}

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