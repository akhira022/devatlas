"use client";

import { useEffect, useState } from "react";

interface TerminalLineProps {
  command: string;
  reduced: boolean;
}

/** Remount with a new `key` to restart the typing effect. */
export function TerminalLine({ command, reduced }: TerminalLineProps) {
  const [typed, setTyped] = useState(0);
  const visible = reduced ? command.length : typed;

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setTyped((count) => {
        if (count >= command.length) {
          clearInterval(timer);
          return count;
        }
        return count + 1;
      });
    }, 45);
    return () => clearInterval(timer);
  }, [command, reduced]);

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-zinc-950 text-zinc-100">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-2 rounded-full bg-zinc-600" />
        <span className="size-2 rounded-full bg-zinc-600" />
        <span className="size-2 rounded-full bg-zinc-600" />
        <span className="flex-1 text-center font-mono text-[11px] text-zinc-500">~/app</span>
      </div>
      <p className="overflow-x-auto px-4 py-4 font-mono text-sm whitespace-nowrap">
        <span className="text-zinc-500">$ </span>
        <span aria-label={command}>{command.slice(0, visible)}</span>
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-zinc-100"
        />
      </p>
    </div>
  );
}
