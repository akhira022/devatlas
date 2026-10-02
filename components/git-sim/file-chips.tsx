"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileCode } from "lucide-react";

import { cn } from "@/lib/utils";
import type { GitSimFile, GitSimFileStatus } from "@/lib/git-sim/types";

const STATUS_STYLES: Record<GitSimFileStatus, { label: string; className: string }> = {
  untracked: {
    label: "untracked",
    className: "border-dashed border-muted-foreground/40 text-muted-foreground",
  },
  clean: { label: "", className: "border-border bg-muted/60 text-foreground" },
  modified: {
    label: "modified",
    className: "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  staged: {
    label: "staged",
    className: "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
};

interface FileChipsProps {
  files: GitSimFile[];
  emptyText: string;
  reduced: boolean;
}

export function FileChips({ files, emptyText, reduced }: FileChipsProps) {
  if (files.length === 0) {
    return <p className="py-3 text-center text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <ul className="flex flex-wrap justify-center gap-2 py-1">
      <AnimatePresence initial={false} mode="popLayout">
        {files.map((file) => {
          const style = STATUS_STYLES[file.status];
          return (
            <motion.li
              key={file.name}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs font-medium",
                style.className,
              )}
            >
              <FileCode className="size-3.5" aria-hidden="true" />
              {file.name}
              {style.label && (
                <span className="text-[10px] font-normal opacity-80">· {style.label}</span>
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
