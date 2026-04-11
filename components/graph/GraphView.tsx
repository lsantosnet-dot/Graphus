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
        backgroundColor="#050505"
        nodeLabel="name"
        nodeColor={(node: any) => node.source === 'Exa.ai' ? "#A855F7" : "#00f3ff"}
        linkColor={(link: any) => link.type === 'descoberta_ia' ? "rgba(168, 85, 247, 0.4)" : "rgba(255, 255, 255, 0.2)"}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={d => (d.weight || 0.5) * 0.01}
        d3VelocityDecay={0.3}
        onEngineStop={() => console.log("Engine Stopped")}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          const isExternal = node.source === 'Exa.ai';
          const color = isExternal ? "#A855F7" : "#00f3ff";
          
          ctx.font = `${fontSize}px Inter`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          
          // Draw Circle
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, isExternal ? 4 : 3, 0, 2 * Math.PI, false);
          ctx.fill();
          
          // Draw Label
          ctx.shadowBlur = 0; // Remove shadow for text
          ctx.fillStyle = isExternal ? "rgba(168, 85, 247, 0.9)" : "rgba(255, 255, 255, 0.8)";
          ctx.fillText(label, node.x, node.y + (isExternal ? 10 : 8));
        }}
      />
    </div>
  );
}
