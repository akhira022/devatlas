import { describe, expect, it } from "vitest";

import { allocateVlsm, prefixForHosts } from "@/lib/netcalc/vlsm";

describe("prefixForHosts", () => {
  it("picks classic sizes", () => {
    expect(prefixForHosts(1)).toBe(32);
    expect(prefixForHosts(2)).toBe(31);
    expect(prefixForHosts(14)).toBe(28);
    expect(prefixForHosts(30)).toBe(27);
    expect(prefixForHosts(62)).toBe(26);
    expect(prefixForHosts(254)).toBe(24);
  });
});

describe("allocateVlsm", () => {
  it("splits 10.0.0.0/16 into departments largest-first", () => {
    const result = allocateVlsm("10.0.0.0/16", [
      { name: "Guest", hosts: 30 },
      { name: "Dev", hosts: 100 },
      { name: "HR", hosts: 20 },
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.allocations.map((a) => a.name)).toEqual(["Dev", "Guest", "HR"]);
    expect(result.allocations[0]?.network).toBe("10.0.0.0");
    expect(result.allocations[0]?.prefix).toBe(25); // 126 usable >= 100
    expect(result.allocations[0]?.usableHosts).toBeGreaterThanOrEqual(100);

    // No overlapping networks
    const nets = result.allocations.map((a) => a.network);
    expect(new Set(nets).size).toBe(nets.length);
    expect(result.leftover).not.toBeNull();
  });

  it("fails when base is too small", () => {
    const result = allocateVlsm("192.168.1.0/28", [
      { name: "A", hosts: 100 },
    ]);
    expect(result.ok).toBe(false);
  });
});
