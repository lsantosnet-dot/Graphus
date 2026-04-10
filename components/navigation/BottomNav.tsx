"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, BrainCircuit, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pointer-events-none">
      <div className="max-w-md mx-auto flex items-center justify-between gap-4 glass p-4 rounded-[2rem] pointer-events-auto border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        
        {/* List Link */}
        <Link 
          href="/" 
          className={cn(
            "flex flex-col items-center gap-1 flex-1 py-1 transition-all rounded-2xl",
            pathname === "/" ? "text-primary bg-primary/10" : "text-white/40 hover:text-white/60"
          )}
        >
          <List size={22} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Notas</span>
        </Link>

        {/* FAB - New Note */}
        <Link 
          href="/notes/new"
          className="relative -top-10 bg-primary text-black p-5 rounded-[1.8rem] shadow-[0_10px_40px_rgba(0,243,255,0.4)] hover:scale-110 active:scale-95 transition-all group"
        >
          <Plus size={28} strokeWidth={3} />
          <div className="absolute inset-0 rounded-[1.8rem] bg-primary animate-ping opacity-20 group-hover:opacity-40" />
        </Link>

        {/* Graph Link */}
        <Link 
          href="/graph" 
          className={cn(
            "flex flex-col items-center gap-1 flex-1 py-1 transition-all rounded-2xl",
            pathname === "/graph" ? "text-primary bg-primary/10" : "text-white/40 hover:text-white/60"
          )}
        >
          <BrainCircuit size={22} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Grafo</span>
        </Link>
      </div>
    </nav>
  );
}
