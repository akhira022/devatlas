"use client";

import { motion } from "framer-motion";

import type { DiagramProps } from "@/components/cheatsheet/diagrams/types";

const PACKETS = [1, 2, 3, 4];

export function PacketsDiagram({ color, reduced }: DiagramProps) {
  return (
    <div className="relative h-full w-full px-3 py-2">
      <span className="absolute top-1.5 left-3 text-[9px] font-semibold text-muted-foreground uppercase">
        sender
      </span>
      <span className="absolute right-3 bottom-1.5 text-[9px] font-semibold text-muted-foreground uppercase">
        receiver
      </span>
      {PACKETS.map((packet, index) => {
        const top = `${24 + (index % 2) * 28}%`;
        const box = (
          <span
            className="flex size-5 items-center justify-center rounded-sm border font-mono text-[9px] font-bold"
            style={{ borderColor: color, backgroundColor: `${color}22`, color }}
          >
            {packet}
          </span>
        );

        if (reduced) {
          return (
            <span key={packet} className="absolute" style={{ top, left: `${14 + index * 20}%` }}>
              {box}
            </span>
          );
        }

        return (
          <motion.span
            key={packet}
            className="absolute"
            style={{ top }}
            animate={{ left: ["4%", "84%"], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.45,
              repeatDelay: 0.6,
              times: [0, 0.15, 0.85, 1],
            }}
          >
            {box}
          </motion.span>
        );
      })}
    </div>
  );
}
