"use client";

import { useMemo, useState } from "react";

import { CalcStepsPanel } from "@/components/netcalc/calc-steps-panel";
import { ErrorBanner, ResultRow } from "@/components/netcalc/result-row";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { explainSubnetFromResult } from "@/lib/netcalc/explain";
import {
  calculateSubnet,
  maskToPrefix,
  parseCidr,
  parseIPv4,
  parseMask,
} from "@/lib/netcalc/ipv4";

export function Ipv4SubnetTab() {
  const [cidr, setCidr] = useState("192.168.1.100/26");
  const [maskOverride, setMaskOverride] = useState("");

  const outcome = useMemo(() => {
    const hasSlash = cidr.trim().includes("/");

    if (!hasSlash && maskOverride.trim()) {
      const ip = parseIPv4(cidr);
      if (!ip.ok) return ip;
      const mask = parseMask(maskOverride);
      if (!mask.ok) return mask;
      const prefix = maskToPrefix(mask.value);
      if (prefix === null) return { ok: false as const, error: "subnet mask ไม่ถูกต้อง" };
      return { ok: true as const, subnet: calculateSubnet(ip.value, prefix) };
    }

    const parsed = parseCidr(cidr);
    if (!parsed.ok) return parsed;

    let prefix = parsed.prefix;
    if (maskOverride.trim()) {
      const mask = parseMask(maskOverride);
      if (!mask.ok) return mask;
      const fromMask = maskToPrefix(mask.value);
      if (fromMask === null) return { ok: false as const, error: "subnet mask ไม่ถูกต้อง" };
      prefix = fromMask;
    }

    return { ok: true as const, subnet: calculateSubnet(parsed.ip, prefix) };
  }, [cidr, maskOverride]);

  const steps = useMemo(
    () => (outcome.ok ? explainSubnetFromResult(outcome.subnet) : []),
    [outcome],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">IP หรือ CIDR</span>
          <Input
            value={cidr}
            onChange={(event) => setCidr(event.target.value)}
            placeholder="192.168.1.100/26"
            spellCheck={false}
            autoComplete="off"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Subnet mask (ถ้าไม่ใส่ใน CIDR)
          </span>
          <Input
            value={maskOverride}
            onChange={(event) => setMaskOverride(event.target.value)}
            placeholder="255.255.255.192"
            spellCheck={false}
            autoComplete="off"
          />
        </label>
      </div>

      {!outcome.ok ? (
        <ErrorBanner message={outcome.error} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle as="h3">ผลคำนวณ</CardTitle>
              <CardDescription>
                {outcome.subnet.ip}/{outcome.subnet.prefix} · Class {outcome.subnet.class} ·{" "}
                {outcome.subnet.isPrivate ? "Private (RFC1918)" : "Public"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl>
                <ResultRow label="Network" value={outcome.subnet.network} />
                <ResultRow label="Broadcast" value={outcome.subnet.broadcast} />
                <ResultRow label="First host" value={outcome.subnet.firstHost ?? "—"} />
                <ResultRow label="Last host" value={outcome.subnet.lastHost ?? "—"} />
                <ResultRow
                  label="Usable hosts"
                  value={String(outcome.subnet.usableHosts)}
                  mono={false}
                />
                <ResultRow label="Subnet mask" value={outcome.subnet.mask} />
                <ResultRow label="Wildcard" value={outcome.subnet.wildcard} />
                <ResultRow
                  label="Addresses"
                  value={String(outcome.subnet.totalAddresses)}
                  mono={false}
                />
              </dl>
              {outcome.subnet.note && (
                <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
                  {outcome.subnet.note}
                </p>
              )}
            </CardContent>
          </Card>

          <CalcStepsPanel steps={steps} />

          <Card>
            <CardHeader>
              <CardTitle as="h3">Binary</CardTitle>
              <CardDescription>แยก network bits / host bits ให้อ่านง่าย</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1 font-mono text-xs sm:text-sm">
                <ResultRow label="IP" value={outcome.subnet.binary.ip} />
                <ResultRow label="Mask" value={outcome.subnet.binary.mask} />
                <ResultRow label="Network" value={outcome.subnet.binary.network} />
                <ResultRow label="Wildcard" value={outcome.subnet.binary.wildcard} />
              </dl>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
