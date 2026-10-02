import type { ProtocolPulseAccent, ProtocolPulseScene } from "@/lib/network/protocol-pulses";

export type CheatsheetCustomDiagram =
  | "osi"
  | "packets"
  | "ip-address"
  | "ports"
  | "subnets"
  | "mac"
  | "switch";

export type CheatsheetDiagram =
  /** Reuse a card from PROTOCOL_PULSES by id (scene, labels and accent). */
  | { kind: "pulse"; pulseId: string }
  | { kind: "scene"; scene: ProtocolPulseScene; leftLabel: string; rightLabel: string }
  | { kind: "custom"; name: CheatsheetCustomDiagram };

export interface CheatsheetItem {
  id: string;
  title: string;
  caption: string;
  accent: ProtocolPulseAccent;
  /** Omitted when the site has no concept page for this topic yet. */
  conceptSlug?: string;
  diagram: CheatsheetDiagram;
}

export interface Cheatsheet {
  slug: string;
  title: string;
  highlight: string;
  description: string;
  items: CheatsheetItem[];
}
