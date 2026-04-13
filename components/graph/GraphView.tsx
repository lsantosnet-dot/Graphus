"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface GraphData {
  nodes: { id: string; name: string; val?: number; source?: string }[];
  links: { source: string; target: string; weight?: number; type?: string }[];
}

export default function GraphView({ data }: { data: GraphData }) {
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const fgRef = useRef<any>(null);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      // Configura a distância das conexões via motor D3
      fgRef.current.d3Force("link").distance((d: any) => (1 - (d.weight || 0.5)) * 150 + 30);
    }
  }, [data]);

  return (
    <div className="force-graph-container w-full h-full">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        width={windowSize.width}
        height={windowSize.height}
        backgroundColor="#141312"
        nodeLabel="name"
        nodeColor={(node: any) => node.source === 'Exa.ai' ? "#588157" : "#A3B18A"}
        linkColor={(link: any) => link.type === 'descoberta_ia' ? "rgba(163, 177, 138, 0.2)" : "rgba(230, 226, 223, 0.08)"}
        linkDirectionalParticles={1}
        linkDirectionalParticleSpeed={d => (d.weight || 0.5) * 0.005}
        linkDirectionalParticleWidth={1}
        d3VelocityDecay={0.4}
        onEngineStop={() => console.log("Engine Stopped")}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 11 / globalScale;
          const isExternal = node.source === 'Exa.ai';
          const nodeColor = isExternal ? "#588157" : "#A3B18A";
          
          ctx.font = `${fontSize}px Manrope`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Subtle organic glow
          ctx.shadowBlur = 15;
          ctx.shadowColor = nodeColor;
          
          // Draw Node (Organic Seed)
          ctx.fillStyle = nodeColor;
          ctx.beginPath();
          ctx.arc(node.x, node.y, isExternal ? 3.5 : 2.5, 0, 2 * Math.PI, false);
          ctx.fill();
          
          // Draw Label with refined contrast
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(230, 226, 223, 0.4)";
          const textY = node.y + (isExternal ? 10 : 8);
          ctx.fillText(label, node.x, textY);
        }}
      />
    </div>
  );
}
