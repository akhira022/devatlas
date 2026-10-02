import { describe, expect, it } from "vitest";

import {
  explainSameSubnet,
  explainSubnet,
  explainVlsmAllocation,
} from "@/lib/netcalc/explain";
import { parseCidr, parseIPv4 } from "@/lib/netcalc/ipv4";
import { allocateVlsm } from "@/lib/netcalc/vlsm";

describe("explainSubnet", () => {
  it("walks through 192.168.1.100/26 with textbook values", () => {
    const cidr = parseCidr("192.168.1.100/26");
    expect(cidr.ok).toBe(true);
    if (!cidr.ok) return;

    const steps = explainSubnet(cidr.ip, cidr.prefix);
    expect(steps.length).toBeGreaterThanOrEqual(7);

    const byId = Object.fromEntries(steps.map((step) => [step.id, step]));
    expect(byId.mask?.result).toContain("255.255.255.192");
    expect(byId.block?.result).toContain("64");
    expect(byId.network?.result).toContain("192.168.1.64");
    expect(byId.broadcast?.result).toContain("192.168.1.127");
    expect(byId.hosts?.result).toMatch(/192\.168\.1\.65/);
    expect(byId.hosts?.result).toMatch(/62/);
    expect(byId.wildcard?.result).toContain("0.0.0.63");

    for (const step of steps) {
      expect(step.inputs.length).toBeGreaterThan(0);
      expect(step.work.length).toBeGreaterThan(0);
      expect(step.formula.length).toBeGreaterThan(0);
    }
  });
});

describe("explainSameSubnet", () => {
  it("shows matching networks for same /24", () => {
    const a = parseIPv4("192.168.1.10");
    const b = parseIPv4("192.168.1.200");
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;

    const steps = explainSameSubnet(a.value, b.value, 24);
    const compare = steps.find((step) => step.id === "compare");
    expect(compare?.result).toMatch(/subnet เดียวกัน/);
  });
});

describe("explainVlsmAllocation", () => {
  it("documents prefix choice for a department", () => {
    const result = allocateVlsm("10.0.0.0/16", [{ name: "Dev", hosts: 100 }]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const steps = explainVlsmAllocation("Dev", 100, result.allocations[0]!, null);
    expect(steps[0]?.result).toMatch(/\/25/);
    expect(steps[1]?.result).toContain("10.0.0.0/25");
  });
});
