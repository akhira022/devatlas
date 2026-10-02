import {
  calculateSubnet,
  ipv4ToString,
  parseCidr,
  prefixToMask,
  type SubnetResult,
} from "@/lib/netcalc/ipv4";

export interface VlsmRequirement {
  name: string;
  hosts: number;
}

export interface VlsmAllocation extends SubnetResult {
  name: string;
  requestedHosts: number;
}

export type VlsmResult =
  | { ok: true; base: string; allocations: VlsmAllocation[]; leftover: string | null }
  | { ok: false; error: string };

/** Smallest prefix that can fit `hosts` usable addresses (with /31,/32 specials). */
export function prefixForHosts(hosts: number): number | null {
  if (!Number.isInteger(hosts) || hosts < 1) return null;
  if (hosts === 1) return 32;
  if (hosts === 2) return 31; // RFC 3021 preferred for exactly 2

  for (let prefix = 30; prefix >= 0; prefix--) {
    const usable = 2 ** (32 - prefix) - 2;
    if (usable >= hosts) return prefix;
  }
  return null;
}

export function allocateVlsm(
  baseCidr: string,
  requirements: VlsmRequirement[],
): VlsmResult {
  const parsed = parseCidr(baseCidr);
  if (!parsed.ok) return parsed;

  if (requirements.length === 0) {
    return { ok: false, error: "กรุณาเพิ่มอย่างน้อย 1 แผนก/กลุ่มที่ต้องการ host" };
  }

  for (const req of requirements) {
    if (!req.name.trim()) {
      return { ok: false, error: "ชื่อแผนกต้องไม่ว่าง" };
    }
    if (!Number.isInteger(req.hosts) || req.hosts < 1) {
      return { ok: false, error: `"${req.name}" จำนวน host ต้องเป็นจำนวนเต็ม ≥ 1` };
    }
  }

  const baseMask = prefixToMask(parsed.prefix);
  const baseNetwork = (parsed.ip & baseMask) >>> 0;
  const baseSize = 2 ** (32 - parsed.prefix);
  const baseEnd = (baseNetwork + baseSize) >>> 0;

  // Sort largest first (classic VLSM)
  const sorted = [...requirements].map((r, index) => ({ ...r, index }));
  sorted.sort((a, b) => b.hosts - a.hosts || a.index - b.index);

  const allocations: VlsmAllocation[] = [];
  let cursor = baseNetwork;

  for (const req of sorted) {
    const prefix = prefixForHosts(req.hosts);
    if (prefix === null) {
      return { ok: false, error: `"${req.name}" ต้องการ host มากเกินกว่าที่ IPv4 รองรับ` };
    }
    if (prefix < parsed.prefix) {
      return {
        ok: false,
        error: `"${req.name}" ต้องการ /${prefix} ซึ่งใหญ่กว่าเครือข่ายต้นทาง /${parsed.prefix}`,
      };
    }

    const blockSize = 2 ** (32 - prefix);
    // Align cursor to block boundary
    const aligned = Math.ceil(cursor / blockSize) * blockSize;
    if (aligned + blockSize > baseEnd || aligned < baseNetwork) {
      return {
        ok: false,
        error: `พื้นที่ใน ${ipv4ToString(baseNetwork)}/${parsed.prefix} ไม่พอสำหรับ "${req.name}" (${req.hosts} hosts)`,
      };
    }

    const subnet = calculateSubnet(aligned, prefix);
    allocations.push({
      ...subnet,
      name: req.name,
      requestedHosts: req.hosts,
    });
    cursor = aligned + blockSize;
  }

  // Restore original request order for display? Plan says allocate largest→smallest.
  // Keep allocation order (largest first) — clearer for learning VLSM.
  const leftover =
    cursor < baseEnd
      ? `${ipv4ToString(cursor)}–${ipv4ToString((baseEnd - 1) >>> 0)}`
      : null;

  return {
    ok: true,
    base: `${ipv4ToString(baseNetwork)}/${parsed.prefix}`,
    allocations,
    leftover,
  };
}
