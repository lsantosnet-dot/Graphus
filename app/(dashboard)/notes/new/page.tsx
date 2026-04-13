"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Sparkles, Wand2, Type, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewNotePage() {
  const [titulo, setTitulo] = useState("");
  const [conteúdo, setConteúdo] = useState("");
  const [loading, setLoading] = useState(false);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  const handleSave = async () => {
    if (!titulo.trim()) {
      alert("Por favor, dê um título à sua ideia.");
      return;
    }

    setLoading(true);
    
    // Obter sessão atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push("/login");
      return;
    }

    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        titulo, 
        conteúdo, 
        user_id: session.user.id 
      }),
    });
    
    if (response.ok) {
      router.push("/"); // Voltar para a lista
      router.refresh();
    } else {
      const errorData = await response.json();
      alert("Erro ao salvar nota: " + (errorData.error || "Erro desconhecido"));
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-background z-[60] flex flex-col animate-in fade-in slide-in-from-right duration-500">
      {/* Editor Header */}
      <header className="p-6 md:p-8 flex items-center justify-between border-b border-white/[0.03] bg-background/40 backdrop-blur-2xl">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center rounded-2xl glass border-white/[0.05] text-foreground/40 hover:text-foreground transition-all duration-300"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-primary/[0.05] text-primary/60 rounded-full border border-primary/10">
            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Fluxo de Consciência Ativo</span>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-primary text-black font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all duration-500 disabled:opacity-50 shadow-xl shadow-primary/10 text-[10px] uppercase tracking-[0.2em]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                Salvar Nodo <Save size={18} />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Editor Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-16 lg:p-32 max-w-5xl mx-auto w-full space-y-16">
        {/* Title Input */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 text-foreground/30 uppercase tracking-[0.4em] font-bold text-[9px]">
            <Type size={12} strokeWidth={1.5} /> Título do Nodo
          </div>
          <input
            type="text"
            placeholder="Título da Ideia..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full bg-transparent border-none text-4xl md:text-6xl serif-title italic text-foreground placeholder:text-foreground/10 focus:outline-none focus:ring-0 transition-all duration-500"
            autoFocus
          />
        </div>

        {/* Content Area */}
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-2.5 text-foreground/30 uppercase tracking-[0.4em] font-bold text-[9px]">
            <Hash size={12} strokeWidth={1.5} /> Conteúdo Cognitvo
          </div>
          <textarea
            placeholder="O que está na sua mente? Documente a pesquisa..."
            value={conteúdo}
            onChange={(e) => setConteúdo(e.target.value)}
            className="w-full h-full min-h-[500px] bg-transparent border-none text-xl md:text-2xl font-sans leading-relaxed text-foreground/70 placeholder:text-foreground/10 focus:outline-none focus:ring-0 resize-none transition-all duration-700"
          />
        </div>
      </div>

      {/* AI Assistance Bar (Conceptual) */}
      {/* AI Assistance Bar */}
      <footer className="p-8 border-t border-white/[0.03] bg-background/60 backdrop-blur-2xl flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2.5 text-primary/40 hover:text-primary transition-all duration-300 text-[9px] font-bold uppercase tracking-[0.2em] bg-primary/[0.03] px-5 py-2.5 rounded-2xl border border-primary/5">
            <Wand2 size={14} strokeWidth={1.5} /> Sugerir Conexões
          </button>
          <button className="flex items-center gap-2.5 text-foreground/20 hover:text-foreground/40 transition-all duration-300 text-[9px] font-bold uppercase tracking-[0.2em] px-5 py-2.5">
            <Sparkles size={14} strokeWidth={1.5} /> Resumo Estruturado
          </button>
        </div>
        <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-foreground/20 hidden sm:block">
          Sincronização Local Ativa
        </div>
      </footer>
    </div>
  );
}
