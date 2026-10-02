"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ErrorBanner, ResultRow } from "@/components/netcalc/result-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { allocateVlsm, type VlsmRequirement } from "@/lib/netcalc/vlsm";

type Row = VlsmRequirement & { id: string };

function newRow(name: string, hosts: number): Row {
  return { id: crypto.randomUUID(), name, hosts };
}

export function VlsmTab() {
  const [base, setBase] = useState("10.0.0.0/16");
  const [rows, setRows] = useState<Row[]>([
    newRow("Dev", 100),
    newRow("Guest", 30),
    newRow("HR", 20),
  ]);

  const outcome = useMemo(
    () =>
      allocateVlsm(
        base,
        rows.map(({ name, hosts }) => ({ name, hosts })),
      ),
    [base, rows],
  );

  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">เครือข่ายต้นทาง (CIDR)</span>
        <Input
          value={base}
          onChange={(event) => setBase(event.target.value)}
          placeholder="10.0.0.0/16"
          spellCheck={false}
        />
      </label>

      <Card>
        <CardHeader>
          <CardTitle as="h3">แผนก / จำนวน host</CardTitle>
          <CardDescription>
            จัดจากใหญ่ไปเล็กอัตโนมัติ (VLSM) — จำนวน host คือ usable hosts ที่ต้องการ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row, index) => (
            <div key={row.id} className="flex flex-wrap items-end gap-2">
              <label className="min-w-[8rem] flex-1 space-y-1">
                <span className="text-[11px] text-muted-foreground">ชื่อ</span>
                <Input
                  value={row.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    setRows((current) =>
                      current.map((item) => (item.id === row.id ? { ...item, name } : item)),
                    );
                  }}
                />
              </label>
              <label className="w-28 space-y-1">
                <span className="text-[11px] text-muted-foreground">Hosts</span>
                <Input
                  type="number"
                  min={1}
                  value={row.hosts}
                  onChange={(event) => {
                    const hosts = Number(event.target.value);
                    setRows((current) =>
                      current.map((item) => (item.id === row.id ? { ...item, hosts } : item)),
                    );
                  }}
                />
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={rows.length <= 1}
                onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                aria-label={`ลบแถว ${index + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRows((current) => [...current, newRow(`Dept ${current.length + 1}`, 10)])}
          >
            <Plus className="size-4" />
            เพิ่มแผนก
          </Button>
        </CardContent>
      </Card>

      {!outcome.ok ? (
        <ErrorBanner message={outcome.error} />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            ฐาน {outcome.base}
            {outcome.leftover ? ` · พื้นที่เหลือ ${outcome.leftover}` : " · ใช้พื้นที่ครบ"}
          </p>
          {outcome.allocations.map((allocation) => (
            <Card key={`${allocation.name}-${allocation.network}`}>
              <CardHeader className="pb-2">
                <CardTitle as="h3" className="text-base">
                  {allocation.name}
                </CardTitle>
                <CardDescription>
                  ขอ {allocation.requestedHosts} hosts → ได้ /{allocation.prefix} (
                  {allocation.usableHosts} usable)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl>
                  <ResultRow
                    label="Network"
                    value={`${allocation.network}/${allocation.prefix}`}
                  />
                  <ResultRow label="Mask" value={allocation.mask} />
                  <ResultRow label="Wildcard" value={allocation.wildcard} />
                  <ResultRow label="Broadcast" value={allocation.broadcast} />
                  <ResultRow
                    label="Host range"
                    value={
                      allocation.firstHost && allocation.lastHost
                        ? `${allocation.firstHost} – ${allocation.lastHost}`
                        : "—"
                    }
                  />
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
