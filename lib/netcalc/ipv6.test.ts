import { describe, expect, it } from "vitest";

import {
  calculateIPv6Cidr,
  compressIPv6,
  expandIPv6,
  parseIPv6,
  toIpv4Mapped,
} from "@/lib/netcalc/ipv6";

describe("parseIPv6", () => {
  it("expands compressed addresses", () => {
    const parsed = parseIPv6("2001:db8::1");
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(expandIPv6(parsed.hextets)).toBe("2001:0db8:0000:0000:0000:0000:0000:0001");
    expect(compressIPv6(parsed.hextets)).toBe("2001:db8::1");
  });

  it("parses IPv4-mapped", () => {
    const mapped = toIpv4Mapped("192.168.1.1");
    expect(mapped.ok).toBe(true);
    if (!mapped.ok) return;
    expect(compressIPv6(mapped.hextets)).toBe("::ffff:c0a8:101");

    const dotted = parseIPv6("::ffff:192.168.1.1");
    expect(dotted.ok).toBe(true);
    if (!dotted.ok) return;
    expect(expandIPv6(dotted.hextets)).toBe("0000:0000:0000:0000:0000:ffff:c0a8:0101");
  });
});

describe("calculateIPv6Cidr", () => {
  it("applies /64 network prefix", () => {
    const result = calculateIPv6Cidr("2001:db8::1/64");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.networkCompressed).toBe("2001:db8::");
    expect(result.result.prefix).toBe(64);
    expect(result.result.expanded).toContain("2001:0db8");
  });

  it("reports ipv4 mapped when present", () => {
    const result = calculateIPv6Cidr("::ffff:192.168.1.1/128");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.ipv4Mapped).toBe("192.168.1.1");
  });
});
