"use client";

import { motion } from "framer-motion";
import { Laptop } from "lucide-react";

import type { DiagramProps } from "@/components/cheatsheet/diagrams/types";

const HOSTS = [20, 50, 80];

export function SwitchDiagram({ color, reduced }: DiagramProps) {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute top-[12%] left-[12%] flex h-[22%] w-[76%] items-center justify-center rounded-md border text-[9px] font-bold"
        style={{ borderColor: color, backgroundColor: `${color}1a`, color }}
      >
        switch
      </div>
      {HOSTS.map((left) => (
        <span
          key={left}
          className="absolute top-[34%] h-[36%] w-px"
          style={{ left: `${left}%`, backgroundColor: `${color}55` }}
        />
      ))}
      {HOSTS.map((left) => (
        <Laptop
          key={left}
          className="absolute top-[70%] size-4 -translate-x-1/2"
          style={{ left: `${left}%`, color }}
          aria-hidden="true"
        />
      ))}
      {!reduced && (
        <motion.span
          className="absolute block size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          animate={{
            left: ["20%", "20%", "80%", "80%"],
            top: ["68%", "34%", "34%", "68%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
        />
      )}
    </div>
  );
}
