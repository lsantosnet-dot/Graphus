"use client";

import { useState, useEffect } from "react";
import { Plus, Search, BrainCircuit, List, X } from "lucide-react";
import GraphView from "@/components/graph/GraphView";
import Editor from "@/components/editor/Editor";
import Auth from "@/components/auth/Auth";
import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";

export default function Home() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [graphData, setGraphData] = useState<{nodes: any[], links: any[]}>({ nodes: [], links: [] });
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGraphData = async () => {
    setLoading(true);
    
    // Buscar notas
    const { data: ntas } = await supabase.from("notas").select("id, titulo");
    // Buscar conexões
    const { data: conxs } = await supabase.from("conexoes").select("id_origem, id_destino");

    if (ntas) {
      const nodes = ntas.map((n: any) => ({ id: n.id, name: n.titulo }));
      const links = conxs ? conxs.map((c: any) => ({ source: c.id_origem, target: c.id_destino })) : [];
      setGraphData({ nodes, links });
      setNotes(ntas);
    }
    setLoading(false);
  };

  useEffect(() => {
    setHasMounted(true);

    // Gerenciar sessão inicial e mudanças
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchGraphData();
    }
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!hasMounted) return null;

  // Se não houver sessão, mostra tela de login
  if (!session) {
    return <Auth />;
  }

  const handleSaveNote = async (novaNota: any) => {
    const response = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({ 
        ...novaNota, 
        user_id: session.user.id 
      }),
    });
    
    if (response.ok) {
      fetchGraphData(); // Recarregar grafo
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Header / Search */}
      <header className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 glass p-3 px-6 rounded-2xl pointer-events-auto">
          <BrainCircuit className="text-primary animate-pulse-slow" />
          <h1 className="font-outfit font-black text-xl tracking-tighter">GRAPHUS</h1>
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <div className="glass flex items-center px-4 rounded-xl">
            <Search size={18} className="text-white/40 mr-2" />
            <input 
              type="text" 
              placeholder="Pesquisa semântica..." 
              className="bg-transparent border-none focus:outline-none text-sm w-48"
            />
          </div>
          <button 
            onClick={handleLogout}
            className="glass p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
            title="Sair do Cérebro"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Graph View */}
      <div className="absolute inset-0">
        <GraphView data={graphData} />
      </div>

      {/* Note Preview (Lateral) */}
      {selectedNote && (
        <div className="absolute top-24 right-6 bottom-24 w-80 glass rounded-3xl p-6 z-30 animate-in slide-in-from-right">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-outfit font-bold text-primary">{selectedNote.titulo}</h2>
            <button onClick={() => setSelectedNote(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
          </div>
          <p className="text-sm text-white/70 line-clamp-[12] leading-relaxed">
            {selectedNote.conteúdo || "Sem conteúdo disponível."}
          </p>
          <div className="mt-6 pt-6 border-t border-white/10">
            <button 
              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all"
              onClick={() => {
                // Futura implementação: Abrir no editor para edição completa
                alert("Edição completa vindo em breve!");
              }}
            >
              EDITAR NOTA
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Note List (Optional overlay) */}
      <div className="absolute top-24 left-6 bottom-6 w-72 glass rounded-3xl p-6 hidden md:flex flex-col gap-4 backdrop-blur-xl bg-black/40 border-white/5 shadow-2xl">
        <div className="flex items-center gap-2 text-primary/80 mb-2">
          <List size={18} />
          <span className="font-bold text-xs uppercase tracking-tighter">Arquivo Cerebral</span>
        </div>
        <div className="overflow-y-auto space-y-3 pr-2 scrollbar-hide">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all cursor-pointer group">
              <h3 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">{note.titulo}</h3>
            </div>
          ))}
          {notes.length === 0 && <p className="text-xs text-white/30 italic">Nenhuma nota encontrada.</p>}
        </div>
      </div>

      {/* FAB - Add Note */}
      <button 
        onClick={() => setIsEditorOpen(true)}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          width: '64px',
          height: '64px',
          backgroundColor: '#00f3ff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(0,243,255,0.4)',
          zIndex: 9999,
          cursor: 'pointer',
          border: 'none',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Plus color="#000" size={32} strokeWidth={3} />
      </button>

      {/* Editor Modal */}
      <Editor 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSave={handleSaveNote}
      />

      {/* Fullscreen Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-outfit text-primary animate-pulse">Sincronizando Sinapses...</p>
          </div>
        </div>
      )}
    </div>
  );
}
