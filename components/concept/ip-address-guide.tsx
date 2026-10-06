"use client";

import { motion } from "framer-motion";
import { Home, Info, Lock, Unlock } from "lucide-react";

import { ZoomablePreview } from "@/components/visualization/zoomable-preview";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const OCTETS = [
  { label: "Octet 1", value: "192", binary: "11000000" },
  { label: "Octet 2", value: "168", binary: "10101000" },
  { label: "Octet 3", value: "1", binary: "00000001" },
  { label: "Octet 4", value: "10", binary: "00001010" },
];

const RULES = [
  "ประกอบด้วย 4 octet",
  "แต่ละ octet = 8 bits",
  "ค่าแต่ละ octet อยู่ระหว่าง 0–255",
  "คั่นด้วยจุด (.)",
];

const PRIVATE_RANGES = [
  "10.0.0.0 – 10.255.255.255",
  "172.16.0.0 – 172.31.255.255",
  "192.168.0.0 – 192.168.255.255",
];

const COMPARE_ROWS = [
  {
    label: "ความยาว",
    ipv4: "32-bit",
    ipv6: "128-bit",
  },
  {
    label: "รูปแบบ",
    ipv4: "Dotted decimal (192.168.1.1)",
    ipv6: "Hexadecimal (2001:0db8:85a3::8a2e)",
  },
  {
    label: "จำนวน address",
    ipv4: "~4.3 พันล้าน",
    ipv6: "~340 undecillion",
  },
];

function SectionHeading({
  step,
  title,
}: {
  step: number;
  title: string;
}) {
  return (
    <h3 className="flex items-baseline gap-2 text-base font-semibold tracking-tight">
      <span className="font-mono text-sm text-sky-600 dark:text-sky-400">{step}.</span>
      <span>{title}</span>
    </h3>
  );
}

function OctetFormatDiagram({ reduced }: { reduced: boolean }) {
  return (
    <div className="w-full min-w-[22rem] px-2 py-4">
      <div className="grid grid-cols-4 gap-2">
        {OCTETS.map((octet, index) => (
          <motion.div
            key={octet.label}
            className="flex flex-col items-center gap-1.5"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
          >
            <span className="text-[11px] font-medium text-muted-foreground">{octet.label}</span>
            <span className="flex h-12 w-full items-center justify-center rounded-lg border border-sky-500/40 bg-sky-500/10 font-mono text-lg font-semibold text-sky-700 dark:text-sky-300">
              {octet.value}
            </span>
            <span className="text-[10px] text-muted-foreground">8 bits</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 px-1">
        <span className="h-px flex-1 bg-border" />
        <span className="rounded-md border border-border/70 bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground">
          รวม 32 bits
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <p className="mt-3 text-center font-mono text-sm tracking-wider text-foreground">
        {OCTETS.map((o) => o.value).join(" . ")}
      </p>
    </div>
  );
}

function BinaryExampleDiagram({ reduced }: { reduced: boolean }) {
  return (
    <div className="w-full min-w-[24rem] px-2 py-4">
      <div className="grid grid-cols-4 gap-3">
        {OCTETS.map((octet, index) => (
          <motion.div
            key={`bin-${octet.value}`}
            className="flex flex-col items-center gap-1"
            initial={reduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.07, duration: 0.3 }}
          >
            <span className="font-mono text-xl font-bold text-foreground">{octet.value}</span>
            <span className="text-[10px] text-muted-foreground">↓</span>
            <span className="rounded-md border border-border/60 bg-muted/60 px-1.5 py-1 font-mono text-[11px] tracking-tight text-muted-foreground">
              {octet.binary}
            </span>
            <span className="text-[10px] text-muted-foreground">(0–255)</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function IpAddressGuide() {
  const reduced = useReducedMotion();

  return (
    <section className="space-y-5" aria-labelledby="ip-address-guide-title">
      <div className="surface-muted p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-sky-600 uppercase dark:text-sky-400">
          Visual Guide
        </p>
        <h2 id="ip-address-guide-title" className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          IP Address
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          สรุปแบบอ่านง่าย — ที่อยู่ของอุปกรณ์บนเครือข่าย รูปแบบ IPv4 ประเภท Public/Private
          และความต่างกับ IPv6
        </p>
      </div>

      <section className="surface-muted space-y-3 p-5 sm:p-6">
        <SectionHeading step={1} title="What is IP Address?" />
        <p className="prose-content text-[0.9375rem]">
          IP (Internet Protocol) Address คือตัวเลขที่ไม่ซ้ำกัน ใช้ระบุอุปกรณ์แต่ละตัวบนเครือข่าย
          เพื่อให้เครื่องต่าง ๆ รู้จักและคุยกันผ่านอินเทอร์เน็ตได้
        </p>
        <div className="flex gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3.5 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          <Home className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            <span className="font-semibold">จำง่าย:</span> IP Address เหมือนบ้านเลขที่ของอุปกรณ์
          </p>
        </div>
      </section>

      <section className="surface-muted space-y-4 p-5 sm:p-6">
        <SectionHeading step={2} title="Format of IP Address (IPv4)" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          IPv4 ยาว 32-bit เขียนแบบ dotted-decimal — เลื่อนหรือ pinch ในพรีวิวได้ถ้าจอแคบ
        </p>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <ZoomablePreview label="รูปแบบ IPv4" className="min-w-0">
            <OctetFormatDiagram reduced={reduced} />
          </ZoomablePreview>

          <ul className="space-y-2 rounded-xl border border-rose-500/25 bg-rose-500/5 p-4 text-sm">
            {RULES.map((rule) => (
              <li key={rule} className="flex gap-2 leading-snug text-rose-900 dark:text-rose-100">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden="true" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-muted space-y-4 p-5 sm:p-6">
        <SectionHeading step={3} title="Example" />
        <ZoomablePreview label="ตัวอย่างแปลงเป็น binary" className="min-w-0">
          <BinaryExampleDiagram reduced={reduced} />
        </ZoomablePreview>
        <div className="flex gap-3 rounded-lg border border-violet-500/30 bg-violet-500/5 px-3.5 py-3 text-sm text-violet-900 dark:text-violet-100">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            <span className="font-semibold">Meaning:</span> แต่ละส่วนของ IP คือตัวเลขระหว่าง 0 ถึง 255
          </p>
        </div>
      </section>

      <section className="surface-muted space-y-4 p-5 sm:p-6">
        <SectionHeading step={4} title="Types of IP Address" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold text-sky-700 dark:text-sky-300">
              <Unlock className="size-4" aria-hidden="true" />
              Public IP
            </div>
            <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
              <li>ISP เป็นคนแจก</li>
              <li>ไม่ซ้ำบนอินเทอร์เน็ต</li>
              <li>ใช้คุยข้ามเน็ตสาธารณะ</li>
            </ul>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold text-teal-700 dark:text-teal-300">
              <Lock className="size-4" aria-hidden="true" />
              Private IP
            </div>
            <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
              <li>ใช้ใน LAN / เครือข่ายบ้าน-ออฟฟิศ</li>
              <li>ซ้ำกันได้ระหว่างวงที่ต่างกัน</li>
            </ul>
            <ul className="mt-3 space-y-1 font-mono text-xs text-teal-800 dark:text-teal-200">
              {PRIVATE_RANGES.map((range) => (
                <li key={range}>{range}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="surface-muted space-y-4 p-5 sm:p-6">
        <SectionHeading step={5} title="IPv4 vs IPv6" />
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-medium">หัวข้อ</th>
                <th className="px-3 py-2.5 font-medium">IPv4</th>
                <th className="px-3 py-2.5 font-medium">IPv6</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, index) => (
                <tr
                  key={row.label}
                  className={cn(
                    "border-t border-border/50",
                    index % 2 === 1 && "bg-muted/25",
                  )}
                >
                  <th className="px-3 py-2.5 font-medium text-foreground">{row.label}</th>
                  <td className="px-3 py-2.5 text-muted-foreground">{row.ipv4}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{row.ipv6}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          * หมายเหตุ: IP อาจเปลี่ยนได้ (dynamic) หรือคงที่ (static)
        </p>
      </section>
    </section>
  );
}
