/** Pure IPv6 helpers — expand, compress, prefix, IPv4-mapped. */

export type IPv6ParseError = { ok: false; error: string };
export type IPv6ParseOk = { ok: true; hextets: number[] };
export type IPv6ParseResult = IPv6ParseOk | IPv6ParseError;

const HEXTET = /^[0-9a-fA-F]{1,4}$/;
const V4_OCTET = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

function parseIpv4Tail(tail: string): number[] | null {
  const parts = tail.split(".");
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const part of parts) {
    if (!V4_OCTET.test(part)) return null;
    octets.push(Number(part));
  }
  return [
    ((octets[0]! << 8) | octets[1]!) & 0xffff,
    ((octets[2]! << 8) | octets[3]!) & 0xffff,
  ];
}

export function parseIPv6(input: string): IPv6ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "กรุณากรอก IPv6 address" };
  if (trimmed.includes("/")) {
    return { ok: false, error: "อย่าใส่ prefix ในช่อง address — ใช้ช่อง prefix แยก" };
  }

  // IPv4-mapped / dotted-quad tail: ::ffff:192.168.1.1 or 2001:db8::192.168.1.1
  let working = trimmed;
  let v4Hextets: number[] | null = null;
  const lastColon = working.lastIndexOf(":");
  if (lastColon !== -1 && working.includes(".")) {
    const maybeV4 = working.slice(lastColon + 1);
    if (maybeV4.includes(".")) {
      v4Hextets = parseIpv4Tail(maybeV4);
      if (!v4Hextets) {
        return { ok: false, error: "ส่วน IPv4 ท้าย address ไม่ถูกต้อง" };
      }
      working = working.slice(0, lastColon + 1) + "0:0";
      // we'll replace the last two hextets after expand
    }
  }

  const doubleColon = working.indexOf("::");
  if (doubleColon !== -1 && working.indexOf("::", doubleColon + 1) !== -1) {
    return { ok: false, error: "IPv6 ใช้ :: ได้แค่ครั้งเดียว" };
  }

  let hextets: number[];

  if (doubleColon !== -1) {
    const [leftRaw, rightRaw] = working.split("::") as [string, string];
    const left = leftRaw === "" ? [] : leftRaw.split(":");
    const right = rightRaw === "" ? [] : rightRaw.split(":");
    if (left.length + right.length > 8) {
      return { ok: false, error: "จำนวน hextet ของ IPv6 เกิน 8" };
    }
    const missing = 8 - left.length - right.length;
    const expanded = [...left, ...Array(missing).fill("0"), ...right];
    hextets = [];
    for (const part of expanded) {
      if (!HEXTET.test(part)) {
        return { ok: false, error: `hextet "${part}" ไม่ถูกต้อง` };
      }
      hextets.push(parseInt(part, 16));
    }
  } else {
    const parts = working.split(":");
    if (parts.length !== 8) {
      return { ok: false, error: "IPv6 แบบเต็มต้องมี 8 hextet หรือใช้ :: ย่อ" };
    }
    hextets = [];
    for (const part of parts) {
      if (!HEXTET.test(part)) {
        return { ok: false, error: `hextet "${part}" ไม่ถูกต้อง` };
      }
      hextets.push(parseInt(part, 16));
    }
  }

  if (v4Hextets) {
    hextets[6] = v4Hextets[0]!;
    hextets[7] = v4Hextets[1]!;
  }

  return { ok: true, hextets };
}

export function expandIPv6(hextets: number[]): string {
  return hextets.map((h) => h.toString(16).padStart(4, "0")).join(":");
}

/** RFC 5952-ish compression: longest run of zeros, leftmost on tie. */
export function compressIPv6(hextets: number[]): string {
  let bestStart = -1;
  let bestLen = 0;
  let runStart = -1;

  for (let i = 0; i <= 8; i++) {
    if (i < 8 && hextets[i] === 0) {
      if (runStart === -1) runStart = i;
    } else if (runStart !== -1) {
      const len = i - runStart;
      if (len > bestLen) {
        bestStart = runStart;
        bestLen = len;
      }
      runStart = -1;
    }
  }

  if (bestLen < 2) {
    return hextets.map((h) => h.toString(16)).join(":");
  }

  const left = hextets.slice(0, bestStart).map((h) => h.toString(16));
  const right = hextets.slice(bestStart + bestLen).map((h) => h.toString(16));
  return `${left.join(":")}::${right.join(":")}`;
}

export function applyPrefix(hextets: number[], prefix: number): number[] {
  if (prefix < 0 || prefix > 128 || !Number.isInteger(prefix)) {
    throw new Error(`IPv6 prefix ${prefix} ไม่ถูกต้อง (0–128)`);
  }
  const result = [...hextets];
  for (let i = 0; i < 8; i++) {
    const bitStart = i * 16;
    if (bitStart + 16 <= prefix) continue;
    if (bitStart >= prefix) {
      result[i] = 0;
      continue;
    }
    const keep = prefix - bitStart;
    const mask = (0xffff << (16 - keep)) & 0xffff;
    result[i] = (result[i]! & mask) >>> 0;
  }
  return result;
}

export function isIpv4Mapped(hextets: number[]): boolean {
  return (
    hextets[0] === 0 &&
    hextets[1] === 0 &&
    hextets[2] === 0 &&
    hextets[3] === 0 &&
    hextets[4] === 0 &&
    hextets[5] === 0xffff
  );
}

export function ipv4MappedToString(hextets: number[]): string | null {
  if (!isIpv4Mapped(hextets)) return null;
  const hi = hextets[6]!;
  const lo = hextets[7]!;
  return `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
}

export function toIpv4Mapped(ipv4: string): IPv6ParseResult {
  const parts = ipv4.trim().split(".");
  if (parts.length !== 4) {
    return { ok: false, error: "IPv4 สำหรับ mapped address ไม่ถูกต้อง" };
  }
  const octets: number[] = [];
  for (const part of parts) {
    if (!V4_OCTET.test(part)) {
      return { ok: false, error: `octet "${part}" ไม่ถูกต้อง` };
    }
    octets.push(Number(part));
  }
  return {
    ok: true,
    hextets: [
      0,
      0,
      0,
      0,
      0,
      0xffff,
      ((octets[0]! << 8) | octets[1]!) & 0xffff,
      ((octets[2]! << 8) | octets[3]!) & 0xffff,
    ],
  };
}

export interface IPv6CidrResult {
  input: string;
  prefix: number;
  expanded: string;
  compressed: string;
  networkExpanded: string;
  networkCompressed: string;
  ipv4Mapped: string | null;
}

export type IPv6CidrParseResult =
  | { ok: true; result: IPv6CidrResult }
  | IPv6ParseError;

export function calculateIPv6Cidr(input: string): IPv6CidrParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "กรุณากรอก IPv6 CIDR เช่น 2001:db8::1/64" };

  const slash = trimmed.lastIndexOf("/");
  if (slash === -1) {
    return { ok: false, error: "กรุณาระบุ prefix เช่น /64" };
  }

  const addr = trimmed.slice(0, slash);
  const prefixRaw = trimmed.slice(slash + 1);
  if (!/^\d{1,3}$/.test(prefixRaw)) {
    return { ok: false, error: "prefix IPv6 ต้องเป็นตัวเลข 0–128" };
  }
  const prefix = Number(prefixRaw);
  if (prefix < 0 || prefix > 128) {
    return { ok: false, error: "prefix IPv6 ต้องอยู่ระหว่าง 0 ถึง 128" };
  }

  const parsed = parseIPv6(addr);
  if (!parsed.ok) return parsed;

  const network = applyPrefix(parsed.hextets, prefix);

  return {
    ok: true,
    result: {
      input: trimmed,
      prefix,
      expanded: expandIPv6(parsed.hextets),
      compressed: compressIPv6(parsed.hextets),
      networkExpanded: expandIPv6(network),
      networkCompressed: compressIPv6(network),
      ipv4Mapped: ipv4MappedToString(parsed.hextets),
    },
  };
}
