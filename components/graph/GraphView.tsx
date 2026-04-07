"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface GraphData {
  nodes: { id: string; name: string; val?: number }[];
  links: { source: string; target: string }[];
}

export default function GraphView({ data }: { data: GraphData }) {
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="force-graph-container w-full h-full">
      <ForceGraph2D
        graphData={data}
        width={windowSize.width}
        height={windowSize.height}
        backgroundColor="#050505"
        nodeLabel="name"
        nodeColor={() => "#00f3ff"}
        linkColor={() => "rgba(255, 255, 255, 0.2)"}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Inter`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00f3ff";
          
          // Draw Circle
          ctx.fillStyle = "#00f3ff";
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3, 0, 2 * Math.PI, false);
          ctx.fill();
          
          // Draw Label
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillText(label, node.x, node.y + 8);
        }}
      />
    </div>
  );
}
