"use client";

import { motion } from "framer-motion";
import { Laptop, Monitor, Smartphone } from "lucide-react";

import type { DiagramProps } from "@/components/cheatsheet/diagrams/types";

const DEVICES = [
  { icon: Laptop, ip: "192.168.1.4" },
  { icon: Smartphone, ip: "192.168.1.7" },
  { icon: Monitor, ip: "192.168.1.9" },
];

export function IpAddressDiagram({ color, reduced }: DiagramProps) {
  return (
    <ul className="flex h-full w-full flex-col justify-center gap-1.5 px-4">
      {DEVICES.map(({ icon: Icon, ip }, index) => {
        const highlighted = index === 1;
        return (
          <li key={ip} className="flex items-center gap-2">
            <Icon className="size-3.5 shrink-0" style={{ color }} aria-hidden="true" />
            <span className="h-px flex-1" style={{ backgroundColor: `${color}55` }} />
            <motion.span
              className="rounded-sm border px-1.5 font-mono text-[10px] leading-4"
              style={{
                borderColor: highlighted ? color : `${color}44`,
                color: highlighted ? color : "var(--muted-foreground)",
                fontWeight: highlighted ? 700 : 500,
              }}
              animate={highlighted && !reduced ? { scale: [1, 1.08, 1] } : undefined}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              {ip}
            </motion.span>
          </li>
        );
      })}
    </ul>
  );
}
