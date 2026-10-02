"use client";

import { useMemo, useState } from "react";

import { CalcStepsPanel } from "@/components/netcalc/calc-steps-panel";
import { ErrorBanner, ResultRow } from "@/components/netcalc/result-row";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { explainSameSubnet } from "@/lib/netcalc/explain";
import {
  calculateSubnet,
  parseIPv4,
  parsePrefix,
  sameSubnet,
} from "@/lib/netcalc/ipv4";

export function SameSubnetTab() {
  const [ipA, setIpA] = useState("192.168.1.10");
  const [ipB, setIpB] = useState("192.168.1.200");
  const [prefixInput, setPrefixInput] = useState("/24");

  const outcome = useMemo(() => {
    const a = parseIPv4(ipA);
    if (!a.ok) return { ok: false as const, error: `IP A: ${a.error}` };
    const b = parseIPv4(ipB);
    if (!b.ok) return { ok: false as const, error: `IP B: ${b.error}` };
    const prefix = parsePrefix(prefixInput);
    if (!prefix.ok) return prefix;

    const match = sameSubnet(a.value, b.value, prefix.prefix);
    const subnetA = calculateSubnet(a.value, prefix.prefix);
    const subnetB = calculateSubnet(b.value, prefix.prefix);

    return {
      ok: true as const,
      match,
      prefix: prefix.prefix,
      ipA: a.value,
      ipB: b.value,
      subnetA,
      subnetB,
    };
  }, [ipA, ipB, prefixInput]);

  const steps = useMemo(
    () =>
      outcome.ok ? explainSameSubnet(outcome.ipA, outcome.ipB, outcome.prefix) : [],
    [outcome],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">IP A</span>
          <Input
            value={ipA}
            onChange={(event) => setIpA(event.target.value)}
            spellCheck={false}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">IP B</span>
          <Input
            value={ipB}
            onChange={(event) => setIpB(event.target.value)}
            spellCheck={false}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Prefix / Mask length</span>
          <Input
            value={prefixInput}
            onChange={(event) => setPrefixInput(event.target.value)}
            placeholder="/24"
            spellCheck={false}
          />
        </label>
      </div>

      {!outcome.ok ? (
        <ErrorBanner message={outcome.error} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle as="h3">
                {outcome.match ? "อยู่ใน subnet เดียวกัน" : "คนละ subnet"}
              </CardTitle>
              <CardDescription>
                เทียบด้วย mask /{outcome.prefix} — network ต้องตรงกันทั้งสองฝั่ง
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={
                  outcome.match
                    ? "mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-200"
                    : "mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-200"
                }
              >
                {outcome.match
                  ? `ทั้งคู่ใช้ network ${outcome.subnetA.network}/${outcome.prefix}`
                  : `A อยู่ ${outcome.subnetA.network}/${outcome.prefix} แต่ B อยู่ ${outcome.subnetB.network}/${outcome.prefix}`}
              </div>
              <dl>
                <ResultRow
                  label="Network A"
                  value={`${outcome.subnetA.network}/${outcome.prefix}`}
                />
                <ResultRow
                  label="Network B"
                  value={`${outcome.subnetB.network}/${outcome.prefix}`}
                />
                <ResultRow label="Mask" value={outcome.subnetA.mask} />
              </dl>
            </CardContent>
          </Card>

          <CalcStepsPanel
            steps={steps}
            description="หา network ของแต่ละ IP แล้วเทียบกัน — ลองทำเองก่อนเปิดคำตอบ"
          />
        </>
      )}
    </div>
  );
}
