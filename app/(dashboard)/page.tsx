"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { List, Search, Clock, ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ArchivePage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

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
        <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-bold text-white">
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
            <p className="text-white/40 font-medium">Sua mente está em branco. Inicie uma nova sinapse.</p>
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
                  <div className="flex items-center gap-3 text-white/30 text-[10px] uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    <span>{note.conteúdo?.length || 0} caracteres</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
            </div>
          ))
        )}
      </div>

      {/* Background Decor */}
      <div className="fixed bottom-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] -z-10 rounded-full pointer-events-none" />
    </div>
  );
}
