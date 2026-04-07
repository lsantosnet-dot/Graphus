"use client";

import { useState, useEffect } from "react";
import { X, Save, Sparkles } from "lucide-react";

export default function Editor({ isOpen, onClose, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nota: any) => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [conteúdo, setConteúdo] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // TODO: Implement real-time suggestions via pgvector similarity
  // This would be a debounced call to an API endpoint

  const handleSave = async () => {
    onSave({ titulo, conteúdo });
    setTitulo("");
    setConteúdo("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl glass z-50 p-8 shadow-2xl flex flex-col gap-6 transform transition-transform duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-outfit font-bold neon-text shadow-primary">Nova Nota Cognitiva</h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <X size={24} />
        </button>
      </div>

      <input
        type="text"
        placeholder="Título da Ideia..."
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="bg-transparent border-b border-white/20 p-2 text-xl focus:outline-none focus:border-primary transition-colors"
      />

      <textarea
        placeholder="O que está na sua mente? Use Markdown..."
        value={conteúdo}
        onChange={(e) => setConteúdo(e.target.value)}
        className="flex-1 bg-transparent border border-white/10 rounded-lg p-4 resize-none focus:outline-none focus:border-primary/50"
      />

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-primary text-background font-bold p-3 rounded-lg flex justify-center items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
        >
          <Save size={20} /> Salvar no Cérebro
        </button>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 text-primary mb-3">
          <Sparkles size={16} />
          <span className="text-sm font-bold uppercase tracking-widest">Conexões Sugeridas</span>
        </div>
        <div className="space-y-2">
          {suggestions.length === 0 ? (
            <p className="text-xs text-white/40 italic">Inicie a escrita para ver relações semânticas...</p>
          ) : (
            suggestions.map((s, i) => (
              <div key={i} className="p-2 bg-white/5 rounded border border-white/10 text-sm hover:bg-white/10 cursor-pointer transition-colors">
                {s.titulo}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
