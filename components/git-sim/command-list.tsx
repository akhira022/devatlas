"use client";

import { cn } from "@/lib/utils";
import type { GitSimCommand } from "@/lib/git-sim/types";

interface CommandListProps {
  commands: GitSimCommand[];
  current: number;
  onSelect: (index: number) => void;
}

export function CommandList({ commands, current, onSelect }: CommandListProps) {
  return (
    <ol
      className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
      aria-label="คำสั่ง Git"
    >
      {commands.map((command, index) => {
        const isCurrent = index === current;
        const isDone = index < current;

        return (
          <li key={command.id} className="shrink-0 lg:shrink">
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "relative flex w-full min-w-40 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                isCurrent
                  ? "border-sky-400 bg-sky-500 text-white shadow-[0_0_24px_-4px] shadow-sky-500/60"
                  : isDone
                    ? "border-border/70 bg-card hover:border-sky-400/50"
                    : "border-border/40 bg-card/50 opacity-55 hover:opacity-90",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isCurrent
                    ? "bg-white/20 text-white"
                    : isDone
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-sm">
                  <span className={isCurrent ? "text-white/75" : "text-muted-foreground"}>git </span>
                  <span className="font-bold">{command.name}</span>
                </span>
                <span
                  className={cn(
                    "block truncate text-xs",
                    isCurrent ? "text-white/85" : "text-muted-foreground",
                  )}
                >
                  {command.label}
                </span>
              </span>
              {isCurrent && (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-2 hidden size-0 -translate-y-1/2 border-y-8 border-l-8 border-y-transparent border-l-sky-500 lg:block"
                />
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
