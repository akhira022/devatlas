"use client";

import { motion } from "framer-motion";

import type { DiagramProps } from "@/components/cheatsheet/diagrams/types";

const LEVELS = [["10.0.0.0/16"], ["/17", "/17"], ["/18", "/18", "/18", "/18"]];

export function SubnetsDiagram({ color, reduced }: DiagramProps) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 px-3">
      {LEVELS.map((level, depth) => (
        <div key={depth} className="flex justify-center gap-1.5">
          {level.map((cidr, index) => (
            <motion.span
              key={`${cidr}-${index}`}
              className="rounded-sm border px-1.5 font-mono text-[9px] leading-4"
              style={{
                borderColor: `${color}${depth === 0 ? "" : "88"}`,
                color: depth === 0 ? color : "var(--foreground)",
                fontWeight: depth === 0 ? 700 : 500,
                backgroundColor: `${color}${depth === 0 ? "22" : "0f"}`,
              }}
              animate={reduced ? undefined : { opacity: [0.35, 1, 1, 0.35] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: depth * 0.5,
                times: [0, 0.2, 0.8, 1],
              }}
            >
              {cidr}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}
