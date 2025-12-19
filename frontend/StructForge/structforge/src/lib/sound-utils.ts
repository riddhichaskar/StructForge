export const playSuccessSound = () => {
  try {
     const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
     const osc = ctx.createOscillator();
     const gain = ctx.createGain();
     osc.connect(gain);
     gain.connect(ctx.destination);
     osc.type = "sine";
     osc.frequency.setValueAtTime(800, ctx.currentTime);
     gain.gain.setValueAtTime(0.1, ctx.currentTime);
     gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
     osc.start();
     osc.stop(ctx.currentTime + 0.5);
  } catch (e) { /* Ignore audio errors */ }
};

export const sendDesktopNotification = async (projectName: string) => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications");
    return;
  }

  // Helper to actually spawn the notification
  const spawn = () => {
    try {
      new Notification("Project Exported Successfully", {
        body: `${projectName}.zip has been downloaded to your device.`,
        // Note: Ensure you have a favicon.ico in your public folder, or remove this line
        icon: "/favicon.ico", 
        silent: false,
      });
    } catch (e) {
      console.error("Notification failed:", e);
    }
  };

  // 1. If granted, send immediately
  if (Notification.permission === "granted") {
    spawn();
    return;
  }

  // 2. If not denied yet, Ask User (This works because it's inside a click handler chain)
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      spawn();
    }
  }
};