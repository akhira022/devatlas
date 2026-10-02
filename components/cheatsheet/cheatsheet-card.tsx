"use client";

import type { ComponentType } from "react";
import Link from "next/link";

import { IpAddressDiagram } from "@/components/cheatsheet/diagrams/ip-address";
import { MacAddressDiagram } from "@/components/cheatsheet/diagrams/mac-address";
import { OsiLayersDiagram } from "@/components/cheatsheet/diagrams/osi-layers";
import { PacketsDiagram } from "@/components/cheatsheet/diagrams/packets";
import { PortsDiagram } from "@/components/cheatsheet/diagrams/ports";
import { SubnetsDiagram } from "@/components/cheatsheet/diagrams/subnets";
import { SwitchDiagram } from "@/components/cheatsheet/diagrams/switch";
import type { DiagramProps } from "@/components/cheatsheet/diagrams/types";
import { PulseTrack } from "@/components/network/protocol-pulse-card";
import type { CheatsheetCustomDiagram, CheatsheetItem } from "@/lib/cheatsheet/types";
import { ACCENT_COLORS, PROTOCOL_PULSES } from "@/lib/network/protocol-pulses";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const CUSTOM_DIAGRAMS: Record<CheatsheetCustomDiagram, ComponentType<DiagramProps>> = {
  osi: OsiLayersDiagram,
  packets: PacketsDiagram,
  "ip-address": IpAddressDiagram,
  ports: PortsDiagram,
  subnets: SubnetsDiagram,
  mac: MacAddressDiagram,
  switch: SwitchDiagram,
};

const FRAME_CLASS =
  "h-28 rounded-lg border border-border/50 bg-muted/40 dark:bg-[#0b1220]/55";

function Diagram({ item }: { item: CheatsheetItem }) {
  const reduced = useReducedMotion();
  const { diagram } = item;

  if (diagram.kind === "custom") {
    const Custom = CUSTOM_DIAGRAMS[diagram.name];
    return (
      <div className={cn(FRAME_CLASS, "overflow-hidden")}>
        <Custom color={ACCENT_COLORS[item.accent].solid} reduced={reduced} />
      </div>
    );
  }

  if (diagram.kind === "scene") {
    return (
      <PulseTrack
        className={FRAME_CLASS}
        accent={item.accent}
        scene={diagram.scene}
        leftLabel={diagram.leftLabel}
        rightLabel={diagram.rightLabel}
      />
    );
  }

  const pulse = PROTOCOL_PULSES.find((p) => p.id === diagram.pulseId);
  if (!pulse) return <div className={FRAME_CLASS} />;
  return (
    <PulseTrack
      className={FRAME_CLASS}
      accent={item.accent}
      scene={pulse.scene}
      leftLabel={pulse.leftLabel}
      rightLabel={pulse.rightLabel}
    />
  );
}

interface CheatsheetCardProps {
  item: CheatsheetItem;
  index: number;
}

export function CheatsheetCard({ item, index }: CheatsheetCardProps) {
  const accent = ACCENT_COLORS[item.accent].solid;
  const content = (
    <>
      <h3 className="mb-2 text-center text-sm font-bold tracking-tight" style={{ color: accent }}>
        {index + 1}. {item.title}
      </h3>
      <Diagram item={item} />
      <p className="mt-2 text-center text-xs leading-snug text-muted-foreground">{item.caption}</p>
    </>
  );

  const className = cn(
    "block h-full rounded-xl border bg-card p-3 shadow-sm transition-all",
    item.conceptSlug && "hover:-translate-y-0.5 hover:shadow-md",
  );
  const style = { borderColor: `${accent}40` };

  if (!item.conceptSlug) {
    return (
      <div className={className} style={style}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/concepts/${item.conceptSlug}`}
      className={className}
      style={style}
      aria-label={`${item.title}: ${item.caption}`}
    >
      {content}
    </Link>
  );
}
