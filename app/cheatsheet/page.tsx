import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GitBranch, LayoutGrid } from "lucide-react";

import { CheatsheetTitle } from "@/components/cheatsheet/cheatsheet-title";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CHEATSHEETS } from "@/lib/cheatsheet";

export const metadata: Metadata = {
  title: "Cheat Sheets",
  description: "สรุปเนื้อหาแบบภาพในจอเดียว และ simulator ที่กดดูทีละขั้น",
};

export default function CheatsheetIndexPage() {
  return (
    <div className="container px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cheat Sheets</h1>
        <p className="mt-2 text-muted-foreground">
          สรุปแบบภาพ อ่านจบในจอเดียว — เหมาะสำหรับทบทวนก่อนลงรายละเอียด
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/git-simulator">
          <Card className="group h-full interactive-card">
            <CardHeader>
              <GitBranch className="mb-2 size-5 text-sky-500" aria-hidden="true" />
              <CardTitle as="h2" className="flex items-center justify-between text-base">
                Top 10 Git Commands
                <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </CardTitle>
              <CardDescription>
                Simulator — กดทีละคำสั่ง ดู working directory, staging, local repo และ remote
                เปลี่ยน
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {CHEATSHEETS.map((sheet) => (
          <Link key={sheet.slug} href={`/cheatsheet/${sheet.slug}`}>
            <Card className="group h-full interactive-card">
              <CardHeader>
                <LayoutGrid className="mb-2 size-5 text-emerald-500" aria-hidden="true" />
                <CardTitle as="h2" className="flex items-center justify-between text-base leading-relaxed">
                  <span>
                    <CheatsheetTitle sheet={sheet} />
                  </span>
                  <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardTitle>
                <CardDescription>
                  {sheet.items.length} การ์ด · {sheet.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
