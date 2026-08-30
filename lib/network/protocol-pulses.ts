export type ProtocolPulseAccent = "blue" | "green" | "orange" | "purple" | "sky" | "rose" | "teal";

export type ProtocolPulseScene =
  | { type: "roundtrip"; label: string }
  | { type: "handshake"; label: string }
  | { type: "burst"; label: string }
  | { type: "secure"; label: string }
  | { type: "resolve"; value: string }
  | { type: "ack"; label: string }
  | { type: "mail-send" }
  | { type: "mail-sync" }
  | { type: "bidirectional" }
  | { type: "stream"; label: string }
  | { type: "preflight"; label: string }
  | { type: "who-has"; query: string; answer: string }
  | { type: "translate"; from: string; to: string }
  | { type: "filter"; allow: string; deny: string }
  | { type: "hop"; label: string }
  | { type: "distribute"; label: string }
  | { type: "cache"; label: string }
  | { type: "route"; label: string }
  | { type: "query"; label: string };

export interface ProtocolPulse {
  id: string;
  title: string;
  subtitle: string;
  accent: ProtocolPulseAccent;
  href: string;
  leftLabel?: string;
  rightLabel?: string;
  scene: ProtocolPulseScene;
}

export const PROTOCOL_PULSES: ProtocolPulse[] = [
  {
    id: "http",
    title: "HTTP/HTTPS",
    subtitle: "Web request ↔ response",
    accent: "blue",
    href: "/visualize/http-flow",
    scene: { type: "roundtrip", label: "200 OK" },
  },
  {
    id: "tcp",
    title: "TCP",
    subtitle: "Reliable 3-way handshake",
    accent: "green",
    href: "/visualize/tcp-flow",
    scene: { type: "handshake", label: "SYN-ACK" },
  },
  {
    id: "udp",
    title: "UDP",
    subtitle: "Fast, no acknowledgement",
    accent: "orange",
    href: "/visualize/udp-flow",
    scene: { type: "burst", label: "NO ACK" },
  },
  {
    id: "tls",
    title: "TLS",
    subtitle: "Encrypted secure session",
    accent: "purple",
    href: "/visualize/https-flow",
    scene: { type: "secure", label: "SECURE SESSION" },
  },
  {
    id: "dns",
    title: "DNS",
    subtitle: "Domain name → IP address",
    accent: "sky",
    href: "/visualize/dns-flow",
    scene: { type: "resolve", value: "93.184.216.34" },
  },
  {
    id: "dhcp",
    title: "DHCP",
    subtitle: "Automatic IP assignment",
    accent: "green",
    href: "/visualize/dhcp-flow",
    scene: { type: "ack", label: "ACK" },
  },
  {
    id: "smtp",
    title: "SMTP",
    subtitle: "Send email",
    accent: "orange",
    href: "/visualize/smtp-flow",
    scene: { type: "mail-send" },
  },
  {
    id: "imap",
    title: "IMAP",
    subtitle: "Sync mailbox messages",
    accent: "blue",
    href: "/visualize/imap-flow",
    scene: { type: "mail-sync" },
  },
  {
    id: "websocket",
    title: "WebSocket",
    subtitle: "Realtime bidirectional frames",
    accent: "teal",
    href: "/visualize/websocket-flow",
    scene: { type: "bidirectional" },
  },
  {
    id: "sse",
    title: "SSE",
    subtitle: "Server push event stream",
    accent: "sky",
    href: "/visualize/sse-flow",
    scene: { type: "stream", label: "event:" },
  },
  {
    id: "rest",
    title: "REST",
    subtitle: "Resource CRUD over HTTP",
    accent: "blue",
    href: "/visualize/rest-flow",
    scene: { type: "roundtrip", label: "GET /users" },
  },
  {
    id: "graphql",
    title: "GraphQL",
    subtitle: "Query exactly the fields needed",
    accent: "rose",
    href: "/visualize/graphql-flow",
    scene: { type: "query", label: "{ user { id } }" },
  },
  {
    id: "cors",
    title: "CORS",
    subtitle: "Cross-origin preflight check",
    accent: "orange",
    href: "/visualize/cors-flow",
    scene: { type: "preflight", label: "OPTIONS → OK" },
  },
  {
    id: "arp",
    title: "ARP",
    subtitle: "IP address → MAC address",
    accent: "green",
    href: "/visualize/arp-flow",
    leftLabel: "Host",
    rightLabel: "LAN",
    scene: { type: "who-has", query: "Who has 10.0.0.5?", answer: "aa:bb:cc:dd" },
  },
  {
    id: "ip",
    title: "IP",
    subtitle: "Packet routing across hops",
    accent: "sky",
    href: "/visualize/ip-flow",
    leftLabel: "Src",
    rightLabel: "Dst",
    scene: { type: "route", label: "TTL-1" },
  },
  {
    id: "nat",
    title: "NAT",
    subtitle: "Private IP ↔ public IP",
    accent: "teal",
    href: "/visualize/nat-flow",
    leftLabel: "LAN",
    rightLabel: "WAN",
    scene: { type: "translate", from: "10.0.0.8", to: "203.0.113.1" },
  },
  {
    id: "firewall",
    title: "Firewall",
    subtitle: "Allow or drop by rules",
    accent: "rose",
    href: "/visualize/firewall-flow",
    leftLabel: "Traffic",
    rightLabel: "Host",
    scene: { type: "filter", allow: "ALLOW 443", deny: "DROP 22" },
  },
  {
    id: "proxy",
    title: "Proxy",
    subtitle: "Forward request via middle hop",
    accent: "purple",
    href: "/visualize/proxy-flow",
    scene: { type: "hop", label: "via proxy" },
  },
  {
    id: "load-balancer",
    title: "Load Balancer",
    subtitle: "Distribute traffic across servers",
    accent: "blue",
    href: "/visualize/load-balancer-flow",
    leftLabel: "Client",
    rightLabel: "Pool",
    scene: { type: "distribute", label: "S1 / S2" },
  },
  {
    id: "cdn",
    title: "CDN",
    subtitle: "Serve from nearest edge cache",
    accent: "orange",
    href: "/visualize/cdn-flow",
    leftLabel: "User",
    rightLabel: "Edge",
    scene: { type: "cache", label: "CACHE HIT" },
  },
  {
    id: "vpn",
    title: "VPN",
    subtitle: "Encrypted tunnel over the internet",
    accent: "purple",
    href: "/visualize/vpn-flow",
    leftLabel: "Device",
    rightLabel: "Gateway",
    scene: { type: "secure", label: "TUNNEL" },
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
  rose: {
    solid: "#F43F5E",
    soft: "rgba(244, 63, 94, 0.18)",
    glow: "0 0 12px rgba(244, 63, 94, 0.75)",
  },
  teal: {
    solid: "#14B8A6",
    soft: "rgba(20, 184, 166, 0.18)",
    glow: "0 0 12px rgba(20, 184, 166, 0.75)",
  },
};
