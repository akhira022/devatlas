"use client";

import { useEffect, useState } from "react";

import type { DiagramProps } from "@/components/cheatsheet/diagrams/types";

const LAYERS = ["Application", "Presentation", "Session", "Transport", "Network", "Data Link", "Physical"];
const SESSION_INDEX = 2;

export function OsiLayersDiagram({ color, reduced }: DiagramProps) {
  const [active, setActive] = useState(SESSION_INDEX);
  const highlighted = reduced ? SESSION_INDEX : active;

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setActive((index) => (index + 1) % LAYERS.length), 900);
    return () => clearInterval(timer);
  }, [reduced]);

  return (
    <ol className="flex h-full w-full flex-col justify-center gap-px px-3">
      {LAYERS.map((layer, index) => {
        const isActive = index === highlighted;
        return (
          <li
            key={layer}
            className="flex items-center gap-2 rounded-sm px-1.5 text-[9px] leading-[13px] transition-colors duration-300"
            style={
              isActive
                ? { backgroundColor: color, color: "#0b1220", fontWeight: 700 }
                : { color: "var(--muted-foreground)" }
            }
          >
            <span className="w-2 font-mono">{LAYERS.length - index}</span>
            {layer}
          </li>
        );
      })}
    </ol>
  );
}
