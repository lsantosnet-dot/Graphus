"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Mostrar após alguns segundos de uso
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-10 sm:w-80 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-700">
      <div className="glass p-5 rounded-3xl border-primary/20 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-3 right-3 p-1 text-white/20 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 text-primary">
            <Download size={24} />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-outfit font-black tracking-tight text-white uppercase">Instalar Graphus</h4>
            <p className="text-[10px] text-white/50 leading-tight">Adicione ao seu home screen para acesso rápido e offline.</p>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          className="w-full mt-4 py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)]"
        >
          Instalar Agora
        </button>
      </div>
    </div>
  );
}
