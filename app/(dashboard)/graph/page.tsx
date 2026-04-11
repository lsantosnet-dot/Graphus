"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import GraphView from "@/components/graph/GraphView";

export default function GraphPage() {
  const [graphData, setGraphData] = useState<{nodes: any[], links: any[]}>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  const fetchGraphData = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/notes");
      const { notas, conexoes } = await response.json();

      if (notas) {
        const nodes = notas.map((n: any) => ({ 
          id: n.id, 
          name: n.titulo,
          source: n.metadata?.source 
        }));
        const links = conexoes ? conexoes.map((c: any) => ({ 
          source: c.id_origem, 
          target: c.id_destino,
          weight: c.peso,
          type: c.tipo_conexao
        })) : [];
        setGraphData({ nodes, links });
      }
    } catch (err) {
      console.error("Erro ao buscar dados do grafo:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGraphData();
  }, [supabase]);

  return (
    <div className="absolute inset-0 pt-20">
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Renderizando Mapa Cognitivo</p>
            </div>
          </div>
        ) : (
          <GraphView data={graphData} />
        )}

        {/* Info Legend */}
        <div className="absolute top-6 left-6 glass p-4 rounded-2xl border-white/5 pointer-events-none animate-in fade-in slide-in-from-left-4 duration-1000">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Visualizador Estático v1</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(0,243,255,0.5)]" />
              <span className="text-[10px] font-bold text-white/60">NODOS (Ideias)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
              <span className="text-[10px] font-bold text-white/60">REFs (Externa)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-[1px] bg-white/20" />
              <span className="text-[10px] font-bold text-white/60">SINAPSES</span>
            </div>
          </div>
        </div>

        {/* UI Controls */}
        <div className="absolute bottom-10 right-10 flex flex-col gap-2">
          <div className="glass p-2 rounded-xl border-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
            3D Mode Disabled
          </div>
        </div>
      </div>
    </div>
  );
}
