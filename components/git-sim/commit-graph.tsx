"use client";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { GitSimRepo } from "@/lib/git-sim/types";

interface CommitGraphProps {
  scope: string;
  repo: GitSimRepo | null;
  head?: string;
  emptyText: string;
  reduced: boolean;
}

function BranchTag({
  scope,
  name,
  isHead,
  reduced,
}: {
  scope: string;
  name: string;
  isHead: boolean;
  reduced: boolean;
}) {
  return (
    <motion.span
      layoutId={reduced ? undefined : `${scope}-branch-${name}`}
      className="flex items-center gap-1"
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <span className="rounded-md bg-sky-500/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-sky-600 dark:text-sky-300">
        {name}
      </span>
      {isHead && (
        <motion.span
          layoutId={reduced ? undefined : `${scope}-head`}
          className="rounded-md bg-foreground px-1.5 py-0.5 font-mono text-[11px] font-bold text-background"
        >
          HEAD
        </motion.span>
      )}
    </motion.span>
  );
}

export function CommitGraph({ scope, repo, head, emptyText, reduced }: CommitGraphProps) {
  if (!repo) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>;
  }

  if (repo.commits.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-sm text-muted-foreground">
        {head && <BranchTag scope={scope} name={head} isHead reduced={reduced} />}
        <p>ยังไม่มี commit</p>
      </div>
    );
  }

  const branchesAt = (commitId: string) =>
    Object.entries(repo.branches)
      .filter(([, id]) => id === commitId)
      .map(([name]) => name)
      .sort((a, b) => (a === head ? -1 : b === head ? 1 : a.localeCompare(b)));

  return (
    <div className="overflow-x-auto pb-1">
      <ol className="relative flex min-w-max items-end px-2 pt-2">
        <AnimatePresence initial={false}>
          {repo.commits.map((commit, index) => {
            const branches = branchesAt(commit.id);
            return (
              <motion.li
                key={commit.id}
                initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex w-20 flex-col items-center"
              >
                <div className="mb-2 flex min-h-12 flex-col-reverse items-center justify-start gap-1">
                  {branches.map((name) => (
                    <BranchTag
                      key={name}
                      scope={scope}
                      name={name}
                      isHead={name === head}
                      reduced={reduced}
                    />
                  ))}
                </div>
                <div className="relative flex w-full items-center justify-center">
                  <span
                    className={cn(
                      "absolute top-1/2 left-0 h-0.5 w-1/2 -translate-y-1/2",
                      index === 0
                        ? "bg-linear-to-r from-transparent to-sky-500/60"
                        : "bg-sky-500/60",
                    )}
                  />
                  {index < repo.commits.length - 1 && (
                    <span className="absolute top-1/2 right-0 h-0.5 w-1/2 -translate-y-1/2 bg-sky-500/60" />
                  )}
                  <span
                    className={cn(
                      "relative z-10 flex size-6 items-center justify-center rounded-full bg-sky-500 ring-4 ring-sky-500/20",
                      branches.length > 0 && "shadow-[0_0_14px] shadow-sky-500/70",
                    )}
                  >
                    <span className="size-2 rounded-full bg-sky-950/70" />
                  </span>
                </div>
                <span className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                  {commit.id}
                </span>
                <span className="max-w-full truncate text-[10px] text-muted-foreground/80">
                  {commit.message}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
}
