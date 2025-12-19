export function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      
      {/* ==============================================
          LIGHT THEME: "Sun-Kissed"
          (Fades out in dark mode via opacity)
      =============================================== */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out dark:opacity-0 opacity-100">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-rose-300/40 blur-[100px] animate-blob mix-blend-multiply" />
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-300/40 blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-cyan-300/40 blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply" />
      </div>

      {/* ==============================================
          DARK THEME: "Deep Nebula"
          (Fades in in dark mode via opacity)
      =============================================== */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0 dark:opacity-100">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-[120px] animate-blob animation-delay-4000" />
      </div>

    </div>
  );
}