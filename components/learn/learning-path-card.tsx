import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, GitBranch, Globe, Radio, Shield, Terminal } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LearningPath } from "@/types/learning-path";
import { DIFFICULTY_COLORS, getDifficultyLabel } from "@/lib/difficulty-labels";

const iconMap = {
  "graduation-cap": GraduationCap,
  globe: Globe,
  "git-branch": GitBranch,
  terminal: Terminal,
  radio: Radio,
  shield: Shield,
} as const;

interface LearningPathCardProps {
  path: LearningPath;
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  const Icon = iconMap[path.icon as keyof typeof iconMap] ?? GraduationCap;

  return (
    <Link href={`/learn/${path.slug}`}>
      <Card className="group h-full interactive-card">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="size-5 text-primary" />
            </div>
            <Badge className={DIFFICULTY_COLORS[path.difficulty]}>
              {getDifficultyLabel(path.difficulty)}
            </Badge>
          </div>
          <CardTitle as="h3" className="flex items-start justify-between gap-2 text-base">
            {path.title}
            <ArrowRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </CardTitle>
          <CardDescription>{path.description}</CardDescription>
          <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              ~{path.estimatedMinutes} นาที
            </span>
            <span>{path.steps.length} บทเรียน</span>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
