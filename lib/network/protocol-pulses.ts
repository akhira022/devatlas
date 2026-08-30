export type ProtocolPulseAccent = "blue" | "green" | "orange" | "purple" | "sky";

export type ProtocolPulseKind =
  | "http"
  | "tcp"
  | "udp"
  | "tls"
  | "dns"
  | "dhcp"
  | "smtp"
  | "imap";

export interface ProtocolPulse {
  id: ProtocolPulseKind;
  title: string;
  subtitle: string;
  accent: ProtocolPulseAccent;
  /** Full step visualization when available */
  href: string;
  durationMs: number;
}

export const PROTOCOL_PULSES: ProtocolPulse[] = [
  {
    id: "http",
    title: "HTTP/HTTPS",
    subtitle: "Web request ↔ response",
    accent: "blue",
    href: "/visualize/http-flow",
    durationMs: 2800,
  },
  {
    id: "tcp",
    title: "TCP",
    subtitle: "Reliable 3-way handshake",
    accent: "green",
    href: "/visualize/tcp-flow",
    durationMs: 3200,
  },
  {
    id: "udp",
    title: "UDP",
    subtitle: "Fast, no acknowledgement",
    accent: "orange",
    href: "/visualize/udp-flow",
    durationMs: 2200,
  },
  {
    id: "tls",
    title: "TLS",
    subtitle: "Encrypted secure session",
    accent: "purple",
    href: "/concepts/tls",
    durationMs: 3000,
  },
  {
    id: "dns",
    title: "DNS",
    subtitle: "Domain name → IP address",
    accent: "sky",
    href: "/visualize/dns-flow",
    durationMs: 2600,
  },
  {
    id: "dhcp",
    title: "DHCP",
    subtitle: "Automatic IP assignment",
    accent: "green",
    href: "/visualize/dhcp-flow",
    durationMs: 2800,
  },
  {
    id: "smtp",
    title: "SMTP",
    subtitle: "Send email",
    accent: "orange",
    href: "/visualize/smtp-flow",
    durationMs: 2400,
  },
  {
    id: "imap",
    title: "IMAP",
    subtitle: "Sync mailbox messages",
    accent: "blue",
    href: "/visualize/imap-flow",
    durationMs: 3000,
  },
];

export const ACCENT_COLORS: Record<
  ProtocolPulseAccent,
  { solid: string; soft: string; glow: string }
> = {
  blue: {
    solid: "#3B82F6",
    soft: "rgba(59, 130, 246, 0.18)",
    glow: "0 0 12px rgba(59, 130, 246, 0.75)",
  },
  green: {
    solid: "#22C55E",
    soft: "rgba(34, 197, 94, 0.18)",
    glow: "0 0 12px rgba(34, 197, 94, 0.75)",
  },
  orange: {
    solid: "#F97316",
    soft: "rgba(249, 115, 22, 0.18)",
    glow: "0 0 12px rgba(249, 115, 22, 0.75)",
  },
  purple: {
    solid: "#A855F7",
    soft: "rgba(168, 85, 247, 0.18)",
    glow: "0 0 12px rgba(168, 85, 247, 0.75)",
  },
  sky: {
    solid: "#38BDF8",
    soft: "rgba(56, 189, 248, 0.18)",
    glow: "0 0 12px rgba(56, 189, 248, 0.75)",
  },
};
