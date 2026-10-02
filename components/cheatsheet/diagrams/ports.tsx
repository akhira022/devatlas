"use client";

import { motion } from "framer-motion";

import type { DiagramProps } from "@/components/cheatsheet/diagrams/types";

const PORTS = [
  { service: "HTTP", port: ":80" },
  { service: "HTTPS", port: ":443" },
  { service: "SSH", port: ":22" },
];
const ACTIVE = 1;

export function PortsDiagram({ color, reduced }: DiagramProps) {
  return (
    <div className="flex h-full w-full items-center gap-2 px-3">
      <ul className="flex flex-1 flex-col gap-2">
        {PORTS.map(({ service }, index) => {
          const active = index === ACTIVE;
          return (
            <li key={service} className="flex items-center gap-1.5">
              <span
                className="w-9 text-[9px] font-bold"
                style={{ color: active ? color : "var(--muted-foreground)" }}
              >
                {service}
              </span>
              <span className="relative h-px flex-1" style={{ backgroundColor: `${color}${active ? "88" : "33"}` }}>
                {active && !reduced && (
                  <motion.span
                    className="absolute top-1/2 block size-2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                    animate={{ left: ["0%", "92%"], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.15, 0.85, 1] }}
                  />
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <div
        className="flex flex-col gap-1 rounded-md border px-1.5 py-1"
        style={{ borderColor: `${color}66` }}
      >
        <span className="text-center text-[8px] font-semibold text-muted-foreground uppercase">
          server
        </span>
        {PORTS.map(({ port }, index) => (
          <span
            key={port}
            className="rounded-sm border px-1 text-center font-mono text-[9px] leading-[14px]"
            style={
              index === ACTIVE
                ? { borderColor: color, color, fontWeight: 700, backgroundColor: `${color}22` }
                : { borderColor: `${color}33`, color: "var(--muted-foreground)" }
            }
          >
            {port}
          </span>
        ))}
      </div>
    </div>
  );
}
