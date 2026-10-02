/** Pure IPv4 helpers — no React, no IO. */

export type IPv4ParseError = { ok: false; error: string };
export type IPv4ParseOk = { ok: true; value: number };
export type IPv4ParseResult = IPv4ParseOk | IPv4ParseError;

const OCTET = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

export function parseIPv4(input: string): IPv4ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "กรุณากรอก IPv4 address" };

  const parts = trimmed.split(".");
  if (parts.length !== 4) {
    return { ok: false, error: "IPv4 ต้องมี 4 octet คั่นด้วยจุด เช่น 192.168.1.1" };
  }

  const octets: number[] = [];
  for (const part of parts) {
    if (!OCTET.test(part)) {
      return { ok: false, error: `octet "${part}" ไม่ถูกต้อง (ต้องเป็น 0–255)` };
    }
    octets.push(Number(part));
  }

  return {
    ok: true,
    value:
      ((octets[0]! << 24) >>> 0) +
      ((octets[1]! << 16) >>> 0) +
      ((octets[2]! << 8) >>> 0) +
      (octets[3]! >>> 0),
  };
}

export function ipv4ToString(value: number): string {
  const n = value >>> 0;
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff,
  ].join(".");
}

export function ipv4ToBinary(value: number): string {
  return ipv4ToString(value)
    .split(".")
    .map((octet) => Number(octet).toString(2).padStart(8, "0"))
    .join(".");
}

export function prefixToMask(prefix: number): number {
  if (prefix < 0 || prefix > 32 || !Number.isInteger(prefix)) {
    throw new Error(`prefix ${prefix} ไม่ถูกต้อง (ต้องเป็น 0–32)`);
  }
  if (prefix === 0) return 0;
  return (0xffff_ffff << (32 - prefix)) >>> 0;
}

export function maskToPrefix(mask: number): number | null {
  const m = mask >>> 0;
  // Must be contiguous 1s then 0s
  if (m === 0) return 0;
  const inverted = (~m) >>> 0;
  // inverted + 1 should be power of 2 (or inverted === 0 for /32)
  if (inverted !== 0 && (inverted & (inverted + 1)) !== 0) return null;
  // Also reject holes in the mask (e.g. 255.0.255.0)
  let bits = 0;
  const remaining = m;
  for (let i = 31; i >= 0; i--) {
    if ((remaining >>> i) & 1) {
      bits++;
    } else {
      // once we hit a 0, rest must be 0
      if ((remaining & ((1 << i) - 1)) !== 0) return null;
      break;
    }
  }
  return bits;
}

export function parsePrefix(input: string): { ok: true; prefix: number } | IPv4ParseError {
  const trimmed = input.trim().replace(/^\//, "");
  if (!/^\d{1,2}$/.test(trimmed)) {
    return { ok: false, error: "prefix ต้องเป็นตัวเลข 0–32 เช่น /24" };
  }
  const prefix = Number(trimmed);
  if (prefix < 0 || prefix > 32) {
    return { ok: false, error: "prefix ต้องอยู่ระหว่าง 0 ถึง 32" };
  }
  return { ok: true, prefix };
}

export function parseMask(input: string): IPv4ParseResult {
  const parsed = parseIPv4(input);
  if (!parsed.ok) return parsed;
  if (maskToPrefix(parsed.value) === null) {
    return {
      ok: false,
      error: "subnet mask ต้องเป็น bitmask ต่อเนื่อง เช่น 255.255.255.0",
    };
  }
  return parsed;
}

export type CidrParseOk = { ok: true; ip: number; prefix: number };
export type CidrParseResult = CidrParseOk | IPv4ParseError;

/** Accepts `192.168.1.100/26` or `192.168.1.100` with separate default prefix. */
export function parseCidr(
  input: string,
  fallbackPrefix?: number,
): CidrParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "กรุณากรอก IP หรือ CIDR เช่น 192.168.1.100/26" };

  const slash = trimmed.indexOf("/");
  if (slash === -1) {
    const ip = parseIPv4(trimmed);
    if (!ip.ok) return ip;
    if (fallbackPrefix === undefined) {
      return { ok: false, error: "กรุณาระบุ prefix เช่น /24 หรือใส่ CIDR แบบ 192.168.1.0/24" };
    }
    return { ok: true, ip: ip.value, prefix: fallbackPrefix };
  }

  const ipPart = trimmed.slice(0, slash);
  const prefixPart = trimmed.slice(slash + 1);
  const ip = parseIPv4(ipPart);
  if (!ip.ok) return ip;
  const prefix = parsePrefix(prefixPart);
  if (!prefix.ok) return prefix;
  return { ok: true, ip: ip.value, prefix: prefix.prefix };
}

export function wildcardFromMask(mask: number): number {
  return (~(mask >>> 0)) >>> 0;
}

export function isPrivateIPv4(value: number): boolean {
  const n = value >>> 0;
  // 10.0.0.0/8
  if ((n >>> 24) === 10) return true;
  // 172.16.0.0/12
  const second = (n >>> 16) & 0xff;
  if ((n >>> 24) === 172 && second >= 16 && second <= 31) return true;
  // 192.168.0.0/16
  if ((n >>> 16) === 0xc0a8) return true;
  return false;
}

export function ipv4Class(value: number): "A" | "B" | "C" | "D" | "E" {
  const first = (value >>> 24) & 0xff;
  if (first < 128) return "A";
  if (first < 192) return "B";
  if (first < 224) return "C";
  if (first < 240) return "D";
  return "E";
}

export interface SubnetResult {
  ip: string;
  prefix: number;
  mask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  firstHost: string | null;
  lastHost: string | null;
  usableHosts: number;
  totalAddresses: number;
  class: "A" | "B" | "C" | "D" | "E";
  isPrivate: boolean;
  binary: {
    ip: string;
    mask: string;
    network: string;
    wildcard: string;
  };
  note?: string;
}

export function calculateSubnet(ip: number, prefix: number): SubnetResult {
  if (prefix < 0 || prefix > 32 || !Number.isInteger(prefix)) {
    throw new Error(`prefix ${prefix} ไม่ถูกต้อง`);
  }

  const mask = prefixToMask(prefix);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);

  let firstHost: number | null = null;
  let lastHost: number | null = null;
  let usableHosts = 0;
  let note: string | undefined;

  if (prefix === 32) {
    usableHosts = 1;
    firstHost = network;
    lastHost = network;
    note = "/32 คือ host เดียว — network และ broadcast คือ IP เดียวกัน";
  } else if (prefix === 31) {
    // RFC 3021: both addresses are usable on a point-to-point link
    usableHosts = 2;
    firstHost = network;
    lastHost = broadcast;
    note = "/31 ตาม RFC 3021 — ใช้ได้ทั้งสอง address สำหรับ point-to-point";
  } else {
    usableHosts = Math.max(0, totalAddresses - 2);
    firstHost = (network + 1) >>> 0;
    lastHost = (broadcast - 1) >>> 0;
  }

  const wildcard = wildcardFromMask(mask);

  return {
    ip: ipv4ToString(ip),
    prefix,
    mask: ipv4ToString(mask),
    wildcard: ipv4ToString(wildcard),
    network: ipv4ToString(network),
    broadcast: ipv4ToString(broadcast),
    firstHost: firstHost === null ? null : ipv4ToString(firstHost),
    lastHost: lastHost === null ? null : ipv4ToString(lastHost),
    usableHosts,
    totalAddresses,
    class: ipv4Class(ip),
    isPrivate: isPrivateIPv4(ip),
    binary: {
      ip: ipv4ToBinary(ip),
      mask: ipv4ToBinary(mask),
      network: ipv4ToBinary(network),
      wildcard: ipv4ToBinary(wildcard),
    },
    note,
  };
}

export function sameSubnet(ipA: number, ipB: number, prefix: number): boolean {
  const mask = prefixToMask(prefix);
  return ((ipA & mask) >>> 0) === ((ipB & mask) >>> 0);
}

export const COMMON_PREFIXES = Array.from({ length: 25 }, (_, i) => {
  const prefix = 8 + i; // /8 to /32
  const mask = prefixToMask(prefix);
  const hostBits = 32 - prefix;
  let usable: number;
  if (prefix === 32) usable = 1;
  else if (prefix === 31) usable = 2;
  else usable = Math.max(0, 2 ** hostBits - 2);
  return {
    prefix,
    mask: ipv4ToString(mask),
    wildcard: ipv4ToString(wildcardFromMask(mask)),
    usableHosts: usable,
  };
});
