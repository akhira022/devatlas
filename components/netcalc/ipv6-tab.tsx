"use client";

import { useMemo, useState } from "react";

import { ErrorBanner, ResultRow } from "@/components/netcalc/result-row";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  calculateIPv6Cidr,
  compressIPv6,
  expandIPv6,
  toIpv4Mapped,
} from "@/lib/netcalc/ipv6";

export function Ipv6Tab() {
  const [cidr, setCidr] = useState("2001:db8::1/64");
  const [ipv4, setIpv4] = useState("192.168.1.1");

  const cidrResult = useMemo(() => calculateIPv6Cidr(cidr), [cidr]);
  const mapped = useMemo(() => toIpv4Mapped(ipv4), [ipv4]);

  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">IPv6 CIDR</span>
        <Input
          value={cidr}
          onChange={(event) => setCidr(event.target.value)}
          placeholder="2001:db8::1/64"
          spellCheck={false}
        />
      </label>

      {!cidrResult.ok ? (
        <ErrorBanner message={cidrResult.error} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle as="h3">ผลคำนวณ IPv6</CardTitle>
            <CardDescription>
              Prefix /{cidrResult.result.prefix} · network bits ถูกบังคับเป็น 0 ในส่วน host
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl>
              <ResultRow label="Compressed" value={cidrResult.result.compressed} />
              <ResultRow label="Expanded" value={cidrResult.result.expanded} />
              <ResultRow
                label="Network (compressed)"
                value={`${cidrResult.result.networkCompressed}/${cidrResult.result.prefix}`}
              />
              <ResultRow label="Network (expanded)" value={cidrResult.result.networkExpanded} />
              {cidrResult.result.ipv4Mapped && (
                <ResultRow label="IPv4 mapped" value={cidrResult.result.ipv4Mapped} />
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle as="h3">IPv4 → IPv4-mapped IPv6</CardTitle>
          <CardDescription>
            แปลงเป็น <code className="font-mono text-xs">::ffff:x.x.x.x</code> (และรูปแบบ hextet)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={ipv4}
            onChange={(event) => setIpv4(event.target.value)}
            placeholder="192.168.1.1"
            spellCheck={false}
          />
          {!mapped.ok ? (
            <ErrorBanner message={mapped.error} />
          ) : (
            <dl>
              <ResultRow label="Compressed" value={compressIPv6(mapped.hextets)} />
              <ResultRow label="Expanded" value={expandIPv6(mapped.hextets)} />
              <ResultRow
                label="Dotted form"
                value={`::ffff:${ipv4.trim()}`}
              />
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
