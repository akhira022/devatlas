"use client";

import { motion } from "framer-motion";

import type { DiagramProps } from "@/components/cheatsheet/diagrams/types";

const OCTETS = ["192", "168", "1", "10"];

export function IpAddressDiagram({ color, reduced }: DiagramProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-3">
      <div className="grid w-full grid-cols-4 gap-1">
        {OCTETS.map((octet, index) => (
          <motion.span
            key={`${octet}-${index}`}
            className="flex h-8 items-center justify-center rounded-md border font-mono text-[11px] font-semibold"
            style={{
              borderColor: index === 3 ? color : `${color}55`,
              color: index === 3 ? color : "var(--muted-foreground)",
              backgroundColor: index === 3 ? `${color}18` : "transparent",
            }}
            animate={
              index === 3 && !reduced ? { scale: [1, 1.06, 1] } : undefined
            }
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            {octet}
          </motion.span>
        ))}
      </div>
      <div className="flex w-full items-center gap-1 px-0.5">
        <span className="h-px flex-1" style={{ backgroundColor: `${color}40` }} />
        <span className="font-mono text-[9px] text-muted-foreground">32-bit</span>
        <span className="h-px flex-1" style={{ backgroundColor: `${color}40` }} />
      </div>
    </div>
  );
}
