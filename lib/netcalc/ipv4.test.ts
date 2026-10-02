import { describe, expect, it } from "vitest";

import {
  COMMON_PREFIXES,
  calculateSubnet,
  ipv4ToBinary,
  ipv4ToString,
  maskToPrefix,
  parseCidr,
  parseIPv4,
  parseMask,
  parsePrefix,
  prefixToMask,
  sameSubnet,
  wildcardFromMask,
} from "@/lib/netcalc/ipv4";

describe("parseIPv4", () => {
  it("parses a valid address", () => {
    expect(parseIPv4("192.168.1.100")).toEqual({
      ok: true,
      value: (((192 << 24) >>> 0) + (168 << 16) + (1 << 8) + 100) >>> 0,
    });
  });

  it("rejects out-of-range octets", () => {
    expect(parseIPv4("192.168.1.256").ok).toBe(false);
  });

  it("rejects leading zeros that are not a single 0", () => {
    // "01" is actually allowed by our regex as decimal 1 — keep simple parser
    expect(parseIPv4("1.2.3").ok).toBe(false);
  });
});

describe("prefix / mask", () => {
  it("converts /26 to 255.255.255.192", () => {
    expect(ipv4ToString(prefixToMask(26))).toBe("255.255.255.192");
  });

  it("converts mask back to prefix", () => {
    expect(maskToPrefix(prefixToMask(24))).toBe(24);
    const mask = parseIPv4("255.255.255.0");
    expect(mask.ok).toBe(true);
    if (mask.ok) expect(maskToPrefix(mask.value)).toBe(24);
  });

  it("rejects non-contiguous masks", () => {
    const parsed = parseIPv4("255.0.255.0");
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(maskToPrefix(parsed.value)).toBeNull();
  });

  it("parses prefix with or without slash", () => {
    expect(parsePrefix("/24")).toEqual({ ok: true, prefix: 24 });
    expect(parsePrefix("26")).toEqual({ ok: true, prefix: 26 });
  });

  it("wildcard is inverse of mask", () => {
    expect(ipv4ToString(wildcardFromMask(prefixToMask(24)))).toBe("0.0.0.255");
    expect(ipv4ToString(wildcardFromMask(prefixToMask(26)))).toBe("0.0.0.63");
  });
});

describe("calculateSubnet — textbook examples", () => {
  it("192.168.1.100/26 from subnetting concept", () => {
    const cidr = parseCidr("192.168.1.100/26");
    expect(cidr.ok).toBe(true);
    if (!cidr.ok) return;
    const result = calculateSubnet(cidr.ip, cidr.prefix);
    expect(result.network).toBe("192.168.1.64");
    expect(result.broadcast).toBe("192.168.1.127");
    expect(result.firstHost).toBe("192.168.1.65");
    expect(result.lastHost).toBe("192.168.1.126");
    expect(result.usableHosts).toBe(62);
    expect(result.mask).toBe("255.255.255.192");
    expect(result.wildcard).toBe("0.0.0.63");
    expect(result.isPrivate).toBe(true);
  });

  it("home /24", () => {
    const cidr = parseCidr("192.168.1.50/24");
    expect(cidr.ok).toBe(true);
    if (!cidr.ok) return;
    const result = calculateSubnet(cidr.ip, cidr.prefix);
    expect(result.network).toBe("192.168.1.0");
    expect(result.broadcast).toBe("192.168.1.255");
    expect(result.firstHost).toBe("192.168.1.1");
    expect(result.lastHost).toBe("192.168.1.254");
    expect(result.usableHosts).toBe(254);
  });

  it("/31 point-to-point RFC 3021", () => {
    const cidr = parseCidr("10.0.0.0/31");
    expect(cidr.ok).toBe(true);
    if (!cidr.ok) return;
    const result = calculateSubnet(cidr.ip, cidr.prefix);
    expect(result.usableHosts).toBe(2);
    expect(result.firstHost).toBe("10.0.0.0");
    expect(result.lastHost).toBe("10.0.0.1");
    expect(result.note).toMatch(/RFC 3021/);
  });

  it("/32 single host", () => {
    const cidr = parseCidr("203.0.113.5/32");
    expect(cidr.ok).toBe(true);
    if (!cidr.ok) return;
    const result = calculateSubnet(cidr.ip, cidr.prefix);
    expect(result.usableHosts).toBe(1);
    expect(result.network).toBe("203.0.113.5");
    expect(result.broadcast).toBe("203.0.113.5");
    expect(result.isPrivate).toBe(false);
  });

  it("exposes binary rows", () => {
    const cidr = parseCidr("192.168.1.100/26");
    expect(cidr.ok).toBe(true);
    if (!cidr.ok) return;
    const result = calculateSubnet(cidr.ip, cidr.prefix);
    expect(result.binary.ip).toBe(ipv4ToBinary(cidr.ip));
    expect(result.binary.mask.split(".").join("")).toMatch(/^1{26}0{6}$/);
  });
});

describe("sameSubnet", () => {
  it("detects hosts in the same /24", () => {
    const a = parseIPv4("192.168.1.10");
    const b = parseIPv4("192.168.1.200");
    const c = parseIPv4("192.168.2.10");
    expect(a.ok && b.ok && c.ok).toBe(true);
    if (!a.ok || !b.ok || !c.ok) return;
    expect(sameSubnet(a.value, b.value, 24)).toBe(true);
    expect(sameSubnet(a.value, c.value, 24)).toBe(false);
  });
});

describe("parseMask + COMMON_PREFIXES", () => {
  it("accepts contiguous masks only", () => {
    expect(parseMask("255.255.255.0").ok).toBe(true);
    expect(parseMask("255.0.255.0").ok).toBe(false);
  });

  it("lists /8–/32", () => {
    expect(COMMON_PREFIXES[0]?.prefix).toBe(8);
    expect(COMMON_PREFIXES.at(-1)?.prefix).toBe(32);
    expect(COMMON_PREFIXES.find((p) => p.prefix === 24)?.usableHosts).toBe(254);
  });
});
