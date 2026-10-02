import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";

import { CheatsheetGrid } from "@/components/cheatsheet/cheatsheet-grid";
import { NETWORK_CHEATSHEET } from "@/lib/cheatsheet/network";
import { GIT_SIM_COMMANDS } from "@/lib/git-sim/commands";

const PREVIEW_COUNT = 4;

export function VisualCheatsheets() {
  return (
    <section className="container px-4 py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">สรุปแบบภาพ</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            อ่านจบในจอเดียว หรือกดดูทีละขั้นว่าเกิดอะไรขึ้น
          </p>
        </div>
        <Link
          href="/cheatsheet"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          ดูทั้งหมด
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <Link
        href="/git-simulator"
        className="group mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-4 transition-colors hover:border-sky-500/60"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-sky-500 text-white">
          <GitBranch className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">
            Top 10 <span className="text-sky-500">Git</span> Commands Simulator
          </span>
          <span className="block text-sm text-muted-foreground">
            {GIT_SIM_COMMANDS.map((command) => command.name).join(" · ")}
          </span>
        </span>
        <ArrowRight
          className="size-4 text-sky-500 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>

      <CheatsheetGrid items={NETWORK_CHEATSHEET.items.slice(0, PREVIEW_COUNT)} />
      <div className="mt-4 text-center">
        <Link
          href={`/cheatsheet/${NETWORK_CHEATSHEET.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          ดูครบ {NETWORK_CHEATSHEET.items.length} แนวคิด {NETWORK_CHEATSHEET.highlight}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
