"use client";

import { useMemo, useState } from "react";

import { ErrorBanner, ResultRow } from "@/components/netcalc/result-row";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  COMMON_PREFIXES,
  ipv4ToString,
  maskToPrefix,
  parseMask,
  parsePrefix,
  prefixToMask,
  wildcardFromMask,
} from "@/lib/netcalc/ipv4";

export function CidrMaskTab() {
  const [prefixInput, setPrefixInput] = useState("/24");
  const [maskInput, setMaskInput] = useState("255.255.255.0");

  const fromPrefix = useMemo(() => {
    const parsed = parsePrefix(prefixInput);
    if (!parsed.ok) return parsed;
    const mask = prefixToMask(parsed.prefix);
    return {
      ok: true as const,
      prefix: parsed.prefix,
      mask: ipv4ToString(mask),
      wildcard: ipv4ToString(wildcardFromMask(mask)),
    };
  }, [prefixInput]);

  const fromMask = useMemo(() => {
    const parsed = parseMask(maskInput);
    if (!parsed.ok) return parsed;
    const prefix = maskToPrefix(parsed.value);
    if (prefix === null) return { ok: false as const, error: "subnet mask ไม่ต่อเนื่อง" };
    return {
      ok: true as const,
      prefix,
      mask: ipv4ToString(parsed.value),
      wildcard: ipv4ToString(wildcardFromMask(parsed.value)),
    };
  }, [maskInput]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle as="h3">CIDR → Mask</CardTitle>
            <CardDescription>ใส่ /24 แล้วได้ subnet mask</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={prefixInput}
              onChange={(event) => setPrefixInput(event.target.value)}
              placeholder="/24"
              spellCheck={false}
            />
            {!fromPrefix.ok ? (
              <ErrorBanner message={fromPrefix.error} />
            ) : (
              <dl>
                <ResultRow label="Prefix" value={`/${fromPrefix.prefix}`} />
                <ResultRow label="Mask" value={fromPrefix.mask} />
                <ResultRow label="Wildcard" value={fromPrefix.wildcard} />
              </dl>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h3">Mask → CIDR</CardTitle>
            <CardDescription>ใส่ 255.255.255.0 แล้วได้ /24</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={maskInput}
              onChange={(event) => setMaskInput(event.target.value)}
              placeholder="255.255.255.0"
              spellCheck={false}
            />
            {!fromMask.ok ? (
              <ErrorBanner message={fromMask.error} />
            ) : (
              <dl>
                <ResultRow label="Prefix" value={`/${fromMask.prefix}`} />
                <ResultRow label="Mask" value={fromMask.mask} />
                <ResultRow label="Wildcard" value={fromMask.wildcard} />
              </dl>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle as="h3">ตาราง prefix ที่ใช้บ่อย</CardTitle>
          <CardDescription>/8 ถึง /32 — กดแถวเพื่อใส่ในช่องด้านบน</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="border-b border-border/60 text-xs text-muted-foreground">
              <tr>
                <th className="py-2 pr-3 font-medium">Prefix</th>
                <th className="py-2 pr-3 font-medium">Mask</th>
                <th className="py-2 pr-3 font-medium">Wildcard</th>
                <th className="py-2 font-medium">Usable hosts</th>
              </tr>
            </thead>
            <tbody>
              {COMMON_PREFIXES.map((row) => (
                <tr
                  key={row.prefix}
                  className="cursor-pointer border-b border-border/30 hover:bg-muted/50"
                  onClick={() => {
                    setPrefixInput(`/${row.prefix}`);
                    setMaskInput(row.mask);
                  }}
                >
                  <td className="py-1.5 pr-3 font-mono">/{row.prefix}</td>
                  <td className="py-1.5 pr-3 font-mono">{row.mask}</td>
                  <td className="py-1.5 pr-3 font-mono">{row.wildcard}</td>
                  <td className="py-1.5 font-mono">{row.usableHosts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
