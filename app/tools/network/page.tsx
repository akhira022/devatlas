import type { Metadata } from "next";
import Link from "next/link";

import { NetworkCalculator } from "@/components/netcalc/network-calculator";

export const metadata: Metadata = {
  title: "เครื่องคิดเลข Network — Subnet, CIDR, VLSM, IPv6",
  description:
    "คำนวณ IPv4 subnet, แปลง CIDR↔mask, ตรวจ subnet เดียวกัน, VLSM และ IPv6 บนเบราว์เซอร์ทันที",
};

export default function NetworkToolsPage() {
  return (
    <div className="container px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">
          เครื่องคิดเลข <span className="text-emerald-500">Network</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          กรอก IP แล้วได้ network, broadcast, host range, wildcard และ binary ทันที — รวม VLSM
          และ IPv6 คำนวณฝั่งเบราว์เซอร์ ไม่ส่งข้อมูลออกเซิร์ฟเวอร์
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          อ่านทฤษฎีก่อนใช้ได้ที่{" "}
          <Link href="/concepts/subnetting" className="font-medium text-primary hover:underline">
            Subnetting
          </Link>{" "}
          ·{" "}
          <Link href="/concepts/ip" className="font-medium text-primary hover:underline">
            IP
          </Link>{" "}
          ·{" "}
          <Link href="/visualize/subnet-flow" className="font-medium text-primary hover:underline">
            Animation subnet
          </Link>
        </p>
      </div>
      <NetworkCalculator />
    </div>
  );
}
