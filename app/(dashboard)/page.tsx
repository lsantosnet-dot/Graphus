"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { List, Search, Clock, ChevronRight, FileText, Trash2, AlertTriangle, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ArchivePage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());
  const [noteToDelete, setNoteToDelete] = useState<any>(null);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notas")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setNotes(data);
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
      <div className="space-y-1">
        <h2 className="text-3xl font-outfit font-black tracking-tighter flex items-center gap-3">
          SISTEMA DE <span className="text-primary italic">ARQUIVOS</span>
        </h2>
        <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold text-white">
          {notes.length} Nodos de Conhecimento Ativos
        </p>
      </div>

      {/* Notes List */}
      <div className="grid gap-4 pb-12">
        {notes.length === 0 ? (
          <div className="glass p-12 rounded-[2rem] border-white/5 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
              <FileText className="text-white/20 w-8 h-8" />
            </div>
            <p className="text-white/60 font-medium">Sua mente está em branco. Inicie uma nova sinapse.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id}
              onClick={() => handleEditClick(note)}
              className="group glass p-5 rounded-[1.8rem] border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors">
                  <FileText className="text-white/30 group-hover:text-primary transition-colors" size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-outfit font-bold text-lg text-white/90 group-hover:text-white transition-colors">
                    {note.titulo}
                  </h3>
                  <div className="flex items-center gap-3 text-white/50 text-[10px] uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    <span>{note.conteúdo?.length || 0} caracteres</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleDeleteClick(e, note)}
                  className="p-3 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Deletar Nota"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight className="text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
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
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-outfit font-black tracking-tighter text-white">
                  CONFIRMAR <span className="text-red-500 italic">EXCLUSÃO</span>
                </h2>
                <p className="text-white/40 text-sm">
                  Esta ação é irreversível. O nodo <span className="text-white/80 font-bold">"{noteToDelete.titulo}"</span> e todas as suas conexões neurais serão permanentemente removidos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => setNoteToDelete(null)}
                className="p-4 rounded-xl border border-white/5 bg-white/5 text-white/60 font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
              >
                Excluir Nodo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => !isSaving && setEditingNote(null)}
          />
          <div className="glass w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2.5rem] border-white/10 relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Modal Glow Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-outfit font-black tracking-tighter text-white">
                  EDITAR <span className="text-primary italic">NODO</span>
                </h2>
              </div>
              <button
                onClick={() => setEditingNote(null)}
                disabled={isSaving}
                className="p-2 text-white/20 hover:text-white transition-colors"
              >
                <ChevronRight className="rotate-90 hidden sm:block" />
                <span className="sm:hidden font-bold text-[10px] uppercase tracking-widest">Fechar</span>
              </button>
            </div>

            {/* Editor Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar">
              <div className="space-y-2">
                <label className="text-white/40 uppercase tracking-[0.3em] font-black text-[10px] px-1">Título do Nodo</label>
                <input
                  type="text"
                  value={editingNote.titulo}
                  onChange={(e) => setEditingNote({ ...editingNote, titulo: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-2xl font-outfit font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Título da Ideia..."
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-white/40 uppercase tracking-[0.3em] font-black text-[10px] px-1">Conteúdo Cognitivo</label>
                <textarea
                  value={editingNote.conteúdo}
                  onChange={(e) => setEditingNote({ ...editingNote, conteúdo: e.target.value })}
                  className="w-full min-h-[300px] flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg font-inter leading-relaxed text-white/80 focus:outline-none focus:border-primary/50 transition-all resize-none"
                  placeholder="Documente a pesquisa..."
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isSaving && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Recalculando Sinapses...</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingNote(null)}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl text-white/40 font-bold text-xs uppercase tracking-widest hover:text-white transition-all disabled:opacity-30"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="bg-primary text-black font-black px-8 py-3 rounded-xl flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(0,243,255,0.2)]"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      SINCRONIZAR <Save size={16} />
                    </>
                  )}
                </button>
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
