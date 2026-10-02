"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Cloud, FolderGit2, FolderOpen, GitCommitHorizontal, Inbox } from "lucide-react";

import { CommandList } from "@/components/git-sim/command-list";
import { CommitGraph } from "@/components/git-sim/commit-graph";
import { FileChips } from "@/components/git-sim/file-chips";
import { TerminalLine } from "@/components/git-sim/terminal-line";
import { FlowControls } from "@/components/visualization/flow-controls";
import { GIT_SIM_COMMANDS, buildTimeline } from "@/lib/git-sim/commands";
import type { GitSimArea } from "@/lib/git-sim/types";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const STEP_DURATION_MS = 3800;

function AreaPanel({
  icon,
  title,
  aside,
  active,
  children,
}: {
  icon: ReactNode;
  title: string;
  aside?: ReactNode;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-card/60 p-3 transition-all duration-300",
        active
          ? "border-sky-400/70 shadow-[0_0_20px_-6px] shadow-sky-500/50"
          : "border-border/50",
      )}
    >
      <header className="mb-2 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <span className={active ? "text-sky-500" : "text-muted-foreground"}>{icon}</span>
          {title}
        </h3>
        {aside && <span className="font-mono text-xs text-muted-foreground">{aside}</span>}
      </header>
      {children}
    </section>
  );
}

export function GitSimulator() {
  const timeline = useMemo(() => buildTimeline(), []);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const reduced = useReducedMotion();

  const command = GIT_SIM_COMMANDS[current];
  const state = timeline[current];
  const isActive = (area: GitSimArea) => command.areas.includes(area);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (current < GIT_SIM_COMMANDS.length - 1) {
        setCurrent(current + 1);
      } else {
        setIsPlaying(false);
      }
    }, STEP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isPlaying, current]);

  const goTo = (index: number) => {
    setIsPlaying(false);
    setCurrent(Math.max(0, Math.min(GIT_SIM_COMMANDS.length - 1, index)));
  };

  const stagedFiles = state.staging.map((name) => ({ name, status: "staged" as const }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <CommandList commands={GIT_SIM_COMMANDS} current={current} onSelect={goTo} />

        <div className="space-y-3 rounded-2xl border border-sky-500/30 bg-muted/30 p-3 sm:p-4 dark:bg-[#0b1220]/60">
          <TerminalLine key={command.id} command={command.command} reduced={reduced} />

          <AreaPanel
            icon={<Cloud className="size-4" />}
            title="Remote"
            aside={state.remote ? "origin" : undefined}
            active={isActive("remote")}
          >
            <CommitGraph
              scope="remote"
              repo={state.remote}
              emptyText="ยังไม่ได้เชื่อมกับ remote"
              reduced={reduced}
            />
          </AreaPanel>

          <AreaPanel
            icon={<GitCommitHorizontal className="size-4" />}
            title="Local repo"
            aside={state.local ? ".git" : undefined}
            active={isActive("local")}
          >
            <CommitGraph
              scope="local"
              repo={state.local}
              head={state.local?.head}
              emptyText="โฟลเดอร์นี้ยังไม่ใช่ Git repository"
              reduced={reduced}
            />
          </AreaPanel>

          <AreaPanel
            icon={<Inbox className="size-4" />}
            title="Staging area"
            active={isActive("staging")}
          >
            <FileChips files={stagedFiles} emptyText="ว่าง" reduced={reduced} />
          </AreaPanel>

          <AreaPanel
            icon={<FolderOpen className="size-4" />}
            title="Working directory"
            active={isActive("working")}
          >
            <FileChips files={state.workingDir} emptyText="ไม่มีไฟล์" reduced={reduced} />
          </AreaPanel>
        </div>
      </div>

      <div className="surface-muted space-y-2 px-4 py-4" aria-live="polite">
        <p className="flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-400">
          <FolderGit2 className="size-3.5" aria-hidden="true" />
          ขั้นที่ {current + 1} · <code className="font-mono">{command.command}</code>
        </p>
        <h2 className="text-lg font-semibold">{command.title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{command.description}</p>
        <Link
          href={`/concepts/${command.conceptSlug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          อ่านเพิ่มเรื่อง git {command.name}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <FlowControls
        isPlaying={isPlaying}
        currentStep={current}
        totalSteps={GIT_SIM_COMMANDS.length}
        onPlay={() => {
          if (current >= GIT_SIM_COMMANDS.length - 1) setCurrent(0);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onReset={() => goTo(0)}
        onPrev={() => goTo(current - 1)}
        onNext={() => goTo(current + 1)}
      />
    </div>
  );
}
