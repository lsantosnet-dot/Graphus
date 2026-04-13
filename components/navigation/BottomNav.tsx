"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, BrainCircuit, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-10 pointer-events-none">
      <div className="max-w-md mx-auto flex items-center justify-between gap-6 glass p-4 px-10 rounded-[2.8rem] pointer-events-auto border-white/[0.03] shadow-2xl">
        
        {/* List Link */}
        <Link 
          href="/" 
          className={cn(
            "flex flex-col items-center gap-1.5 flex-1 py-1.5 transition-all rounded-2xl",
            pathname === "/" ? "text-primary bg-primary/[0.08]" : "text-foreground/20 hover:text-foreground/40"
          )}
        >
          <List size={22} strokeWidth={1.5} />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Notas</span>
        </Link>

        {/* FAB - New Note */}
        <Link 
          href="/notes/new"
          className="relative -top-12 bg-primary text-black p-6 rounded-[2.2rem] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
        >
          <Plus size={32} strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-[2.2rem] bg-primary animate-pulse opacity-10 group-hover:opacity-30" />
        </Link>

        {/* Graph Link */}
        <Link 
          href="/graph" 
          className={cn(
            "flex flex-col items-center gap-1.5 flex-1 py-1.5 transition-all rounded-2xl",
            pathname === "/graph" ? "text-primary bg-primary/[0.08]" : "text-foreground/20 hover:text-foreground/40"
          )}
        >
          <BrainCircuit size={22} strokeWidth={1.5} />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Grafo</span>
        </Link>
      </div>
    </nav>
  );
}
