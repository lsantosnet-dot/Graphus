"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { List, Search, Clock, ChevronRight, FileText, Trash2, AlertTriangle, Save, RefreshCcw, Sparkles, Radar, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ArchivePage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());
  const [noteToDelete, setNoteToDelete] = useState<any>(null);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [discoveringId, setDiscoveringId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const filteredNotes = notes.filter(note => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      note.titulo?.toLowerCase().includes(q) || 
      note.conteúdo?.toLowerCase().includes(q)
    );
  });

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notes");
      const { notas } = await response.json();
      if (notas) {
        setNotes(notas);
      }
    } catch (err) {
      console.error("Erro ao buscar notas:", err);
    }
    setLoading(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, note: any) => {
    e.stopPropagation();
    setNoteToDelete(note);
  };

  const handleEditClick = (note: any) => {
    setEditingNote({ ...note });
  };

  const handleSaveEdit = async () => {
    if (!editingNote || !editingNote.titulo.trim()) return;

    setIsSaving(true);
    const response = await fetch("/api/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingNote.id,
        titulo: editingNote.titulo,
        conteúdo: editingNote.conteúdo,
      }),
    });

    if (response.ok) {
      await fetchNotes(); // Refresh list to get updated data and connections
      setEditingNote(null);
    } else {
      const errorData = await response.json();
      alert("Erro ao salvar nota: " + (errorData.error || "Erro desconhecido"));
    }
    setIsSaving(false);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;

    const idToRemove = noteToDelete.id;
    const originalNotes = [...notes];

    // Optimistic Update
    setNotes(notes.filter((n) => n.id !== idToRemove));
    setNoteToDelete(null);

    const { error } = await supabase
      .from("notas")
      .delete()
      .eq("id", idToRemove);

    if (error) {
      console.error("Erro ao deletar nota:", error);
      // Revert on error
      setNotes(originalNotes);
      alert("Falha ao deletar a nota. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [supabase]);

  const handleRecalibrate = async () => {
    if (!confirm("Isso irá recalibrar todos os seus embeddings e conexões. Pode levar alguns segundos. Continuar?")) return;
    
    setIsSaving(true);
    try {
      const response = await fetch("/api/notes/recalibrate", { method: "POST" });
      if (response.ok) {
        alert("Recalibração concluída com sucesso!");
        await fetchNotes();
      } else {
        alert("Erro na recalibração.");
      }
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  const handleDiscovery = async (e: React.MouseEvent, note: any) => {
    e.stopPropagation();
    if (discoveringId) return;

    setDiscoveringId(note.id);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notaId: note.id,
          titulo: note.titulo,
          "conteúdo": note.conteúdo,
          user_id: user?.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes((prev: any[]) => [data.newNote, ...prev]);
      } else {
        const error = await response.json();
        alert(error.error || "Falha na descoberta.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com a rede neural externa.");
    } finally {
      setDiscoveringId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Title */}
        <div className="flex items-center justify-between pb-4">
          <div className="space-y-1">
            <h2 className="serif-title text-4xl text-foreground flex items-center gap-3">
              Sistema de <span className="text-primary not-italic">Arquivos</span>
            </h2>
            <p className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] font-medium">
              {notes.length} Nodos de Conhecimento Ativos
            </p>
          </div>
          <button
            onClick={handleRecalibrate}
            disabled={isSaving}
            className="group flex items-center gap-2 px-5 py-2.5 bg-primary/[0.03] hover:bg-primary/[0.08] border border-primary/10 rounded-2xl transition-all text-primary/80 hover:text-primary"
            title="Recalibrar Conexões IA"
          >
            <RefreshCcw size={16} className={cn("transition-transform duration-1000", isSaving && "animate-spin")} />
            <span className="text-[9px] font-bold uppercase tracking-widest hidden sm:inline">Recalibrar Grafo</span>
          </button>
        </div>

      {/* Notes List */}
      <div className="grid gap-4 pb-12">
        {filteredNotes.length === 0 ? (
          <div className="glass p-12 rounded-[2rem] border-white/5 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
              <FileText className="text-white/20 w-8 h-8" />
            </div>
            <p className="text-white/60 font-medium">
              {query ? "Nenhum nodo encontrado para esta pesquisa." : "Sua mente está em branco. Inicie uma nova sinapse."}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div 
              key={note.id}
              onClick={() => handleEditClick(note)}
              className={cn(
                "group glass p-6 rounded-[2.2rem] border-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-500 cursor-pointer flex items-center justify-between relative overflow-hidden",
                discoveringId === note.id && "animate-garden-pulse"
              )}
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 bg-foreground/[0.03] rounded-[1.4rem] flex items-center justify-center border border-white/[0.05] group-hover:border-primary/20 group-hover:bg-primary/[0.05] transition-all duration-500",
                  note.metadata?.source === 'Exa.ai' && "border-primary/20 bg-primary/[0.03]"
                )}>
                  <FileText className={cn(
                    "text-foreground/20 group-hover:text-primary/60 transition-colors",
                    note.metadata?.source === 'Exa.ai' && "text-primary/80"
                  )} size={22} />
                </div>
                <div className="space-y-1.5 focus-within:ring-0">
                  <div className="flex items-center gap-3">
                    <h3 className="serif-title text-xl text-foreground/80 group-hover:text-foreground transition-colors duration-500">
                      {note.titulo}
                    </h3>
                    {note.metadata?.source === 'Exa.ai' && (
                      <span className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[7px] font-bold uppercase tracking-widest rounded-full">
                        Exa.ai
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-foreground/30 text-[9px] uppercase tracking-widest font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock size={10} className="opacity-50" /> {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 bg-foreground/10 rounded-full" />
                    <span>{note.conteúdo?.length || 0} carac.</span>
                    {note.metadata?.url && (
                      <>
                        <span className="w-1 h-1 bg-white/10 rounded-full" />
                        <a 
                          href={note.metadata.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          FONTE <ExternalLink size={10} />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {note.metadata?.source !== 'Exa.ai' && (
                  <button
                    onClick={(e) => handleDiscovery(e, note)}
                    disabled={!!discoveringId}
                    className={cn(
                      "p-3.5 text-foreground/20 hover:text-primary hover:bg-primary/[0.08] rounded-2xl transition-all duration-300",
                      discoveringId === note.id && "animate-spin text-primary"
                    )}
                    title="Descoberta Semântica Global"
                  >
                    {discoveringId === note.id ? <RefreshCcw size={18} /> : <Radar size={20} />}
                  </button>
                )}
                <button
                  onClick={(e) => handleDeleteClick(e, note)}
                  className="p-3.5 text-foreground/20 hover:text-red-400 hover:bg-red-400/[0.08] rounded-2xl transition-all duration-300"
                  title="Deletar Nota"
                >
                  <Trash2 size={20} />
                </button>
                <ChevronRight className="text-foreground/10 group-hover:text-primary group-hover:translate-x-1.5 transition-all duration-500" size={20} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setNoteToDelete(null)}
          />
          <div className="glass w-full max-w-md p-8 rounded-[2rem] border-white/10 relative z-10 space-y-6 overflow-hidden shadow-2xl">
            {/* Modal Glow Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-transparent via-red-500 to-transparent opacity-50" />
            
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="w-20 h-20 bg-red-400/[0.05] rounded-3xl flex items-center justify-center border border-red-400/10 text-red-400/60">
                <AlertTriangle size={36} strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                <h2 className="serif-title text-3xl text-foreground">
                  Confirmar <span className="text-red-400 italic">Exclusão</span>
                </h2>
                <p className="text-foreground/40 text-[13px] leading-relaxed">
                  Esta ação é irreversível. O nodo <span className="text-foreground/80 font-bold">"{noteToDelete.titulo}"</span> e todas as suas conexões neurais serão permanentemente removidos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => setNoteToDelete(null)}
                className="p-4 rounded-2xl border border-white/[0.03] bg-foreground/[0.02] text-foreground/40 font-bold text-[10px] uppercase tracking-widest hover:bg-foreground/[0.05] hover:text-foreground transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="p-4 rounded-2xl border border-red-400/10 bg-red-400/[0.05] text-red-400/80 font-bold text-[10px] uppercase tracking-widest hover:bg-red-400 hover:text-white transition-all duration-500 shadow-lg shadow-red-400/5"
              >
                Excluir Nodo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => !isSaving && setEditingNote(null)}
          />
          <div className="glass w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2.5rem] border-white/10 relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Modal Glow Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/[0.05] rounded-2xl flex items-center justify-center border border-primary/10 text-primary/60">
                  <FileText size={22} strokeWidth={1.5} />
                </div>
                <h2 className="serif-title text-2xl text-foreground">
                  Editar <span className="text-primary italic">Nodo</span>
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="bg-primary text-black font-bold px-8 py-3 rounded-2xl flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all duration-500 disabled:opacity-50 shadow-xl shadow-primary/10 text-[10px] uppercase tracking-[0.2em]"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Sincronizar <Save size={14} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditingNote(null)}
                  disabled={isSaving}
                  className="p-2 text-white/20 hover:text-white transition-colors"
                >
                  <ChevronRight className="rotate-90 hidden sm:block" />
                  <span className="sm:hidden font-bold text-[10px] uppercase tracking-widest">Fechar</span>
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar">
              <div className="space-y-2">
                <label className="text-foreground/30 uppercase tracking-[0.4em] font-bold text-[9px] px-2 mb-2 block">Título do Nodo</label>
                <input
                  type="text"
                  value={editingNote.titulo}
                  onChange={(e) => setEditingNote({ ...editingNote, titulo: e.target.value })}
                  className="w-full bg-foreground/[0.02] border border-white/[0.05] rounded-3xl p-5 text-3xl serif-title text-foreground focus:outline-none focus:border-primary/30 transition-all duration-500"
                  placeholder="Título da Ideia..."
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-foreground/30 uppercase tracking-[0.4em] font-bold text-[9px] px-2 mb-2 block">Conteúdo Cognitivo</label>
                <textarea
                  value={editingNote.conteúdo}
                  onChange={(e) => setEditingNote({ ...editingNote, conteúdo: e.target.value })}
                  className="w-full min-h-[400px] flex-1 bg-foreground/[0.02] border border-white/[0.05] rounded-3xl p-8 text-xl font-sans leading-relaxed text-foreground/70 focus:outline-none focus:border-primary/30 transition-all duration-500 resize-none"
                  placeholder="Documente a pesquisa..."
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Footer - Minimal status */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-center">
              <div className="flex items-center gap-3 min-h-[24px]">
                {isSaving && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_rgba(0,243,255,1)]" />
                    <span className="text-[8px] font-black uppercase tracking-widest">SINCRONIZANDO...</span>
                  </div>
                )}
                {!isSaving && (
                  <button
                    onClick={() => setEditingNote(null)}
                    className="text-white/20 hover:text-white/40 font-bold text-[9px] uppercase tracking-[0.2em] transition-all"
                  >
                    DISCARD CHANGES
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className="fixed bottom-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] -z-10 rounded-full pointer-events-none" />
    </div>
  );
}
