"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { List, Search, Clock, ChevronRight, FileText, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ArchivePage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());
  const [noteToDelete, setNoteToDelete] = useState<any>(null);
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

      {/* Background Decor */}
      <div className="fixed bottom-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] -z-10 rounded-full pointer-events-none" />
    </div>
  );
}
