"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

import type { DiagramProps } from "@/components/cheatsheet/diagrams/types";

export function MacAddressDiagram({ color, reduced }: DiagramProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5">
      <motion.div
        className="flex items-center gap-1.5 rounded-md border px-2 py-1"
        style={{ borderColor: color, backgroundColor: `${color}1a`, color }}
        animate={reduced ? undefined : { boxShadow: [`0 0 0px ${color}00`, `0 0 14px ${color}aa`, `0 0 0px ${color}00`] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        <Cpu className="size-4" aria-hidden="true" />
        <span className="text-[10px] font-bold">NIC</span>
      </motion.div>
      <span className="font-mono text-[10px] font-semibold" style={{ color }}>
        3C:5A:B4:07:D1:9E
      </span>
      <span className="text-[8px] font-semibold tracking-wider text-muted-foreground uppercase">
        burned in
      </span>
    </div>
  );
}
