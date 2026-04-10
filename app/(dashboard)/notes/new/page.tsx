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
      <header className="p-6 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center rounded-2xl glass border-white/5 text-white/40 hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sincronização Ativa</span>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-primary text-black font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(0,243,255,0.2)]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                SALVAR SINAPSE <Save size={18} />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Editor Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 lg:p-24 max-w-5xl mx-auto w-full space-y-12">
        {/* Title Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/20 uppercase tracking-[0.3em] font-black text-[10px]">
            <Type size={12} /> Título do Nodo
          </div>
          <input
            type="text"
            placeholder="Título da Ideia..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full bg-transparent border-none text-4xl md:text-6xl font-outfit font-black tracking-tighter text-white placeholder:text-white/5 focus:outline-none focus:ring-0 transition-all"
            autoFocus
          />
        </div>

        {/* Content Area */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2 text-white/20 uppercase tracking-[0.3em] font-black text-[10px]">
            <Hash size={12} /> Conteúdo Cognitivo (Supports Markdown)
          </div>
          <textarea
            placeholder="O que está na sua mente? Documente a pesquisa..."
            value={conteúdo}
            onChange={(e) => setConteúdo(e.target.value)}
            className="w-full h-full min-h-[400px] bg-transparent border-none text-xl md:text-2xl font-inter leading-relaxed text-white/80 placeholder:text-white/5 focus:outline-none focus:ring-0 resize-none transition-all"
          />
        </div>
      </div>

      {/* AI Assistance Bar (Conceptual) */}
      <footer className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
            <Wand2 size={14} /> Sugerir Conexões
          </button>
          <button className="flex items-center gap-2 text-white/20 hover:text-white/40 transition-colors text-[10px] font-black uppercase tracking-widest px-4 py-2">
            <Sparkles size={14} /> Resumo IA
          </button>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 hidden sm:block">
          Draft Saved Locally
        </div>
      </footer>
    </div>
  );
}
