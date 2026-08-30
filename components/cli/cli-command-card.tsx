import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CLI_PLATFORM_LABELS } from "@/lib/content/get-concepts";
import { getDifficultyLabel } from "@/lib/difficulty-labels";
import type { Concept } from "@/types/concept";

const PLATFORM_SHORT: Record<string, string> = {
  unix: "Unix",
  windows: "Win",
};

interface CliCommandCardProps {
  concept: Concept;
}

export function CliCommandCard({ concept }: CliCommandCardProps) {
  const isGit = concept.category === "git-github";
  const platform = concept.platform;
  const platformShort = platform ? (PLATFORM_SHORT[platform] ?? platform) : null;

  return (
    <Link href={`/concepts/${concept.slug}`} className="group block h-full">
      <Card className="h-full border-border/60 transition-all hover:border-primary/50 hover:bg-accent/20 hover:shadow-sm">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle as="h3" className="font-mono text-base font-semibold tracking-tight">
                {concept.title}
              </CardTitle>
              {concept.fullName && (
                <p className="mt-1 text-xs text-muted-foreground">{concept.fullName}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              {platformShort && (
                <Badge variant="outline" className="text-xs font-normal">
                  {platformShort}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {getDifficultyLabel(concept.difficulty)}
              </Badge>
            </div>
          </div>

          <CardDescription className="line-clamp-2 text-sm leading-relaxed">
            {concept.summary}
          </CardDescription>

          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Terminal className="size-3" aria-hidden="true" />
              {isGit ? "Git & GitHub" : platform ? CLI_PLATFORM_LABELS[platform] : "CLI"}
            </span>
            <span className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              ดูรายละเอียด
              <ArrowRight className="size-3" aria-hidden="true" />
            </span>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
