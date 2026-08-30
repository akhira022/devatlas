import { Book, CloudUpload, GitBranch, GitPullRequest, History, Workflow } from "lucide-react";

import { CliCommandCard } from "@/components/cli/cli-command-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CliSubcategory, Concept } from "@/types/concept";

const SUBCATEGORY_ICONS = {
  book: Book,
  workflow: Workflow,
  "cloud-upload": CloudUpload,
  "git-branch": GitBranch,
  history: History,
  github: GitPullRequest,
} as const;

interface GitCategoryViewProps {
  groups: Array<{ subcategory: CliSubcategory; concepts: Concept[] }>;
  accentColor: string;
  totalCommands: number;
}

function subcategoryAnchor(slug: string) {
  return `git-${slug}`;
}

export function GitCategoryView({ groups, accentColor, totalCommands }: GitCategoryViewProps) {
  return (
    <div className="space-y-10">
      <Card className="surface-muted border-border/60">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle as="h2" className="text-lg">คู่มือ Git & GitHub</CardTitle>
              <CardDescription className="mt-1 max-w-2xl">
                คำสั่งที่ใช้ทุกวัน ตั้งแต่ commit จนถึง Pull Request — ใช้ได้ทั้ง macOS, Linux และ
                Windows
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {totalCommands} หัวข้อ
            </Badge>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="ข้ามไปยังส่วน Git">
            {groups.map(({ subcategory, concepts }) => (
              <a
                key={subcategory.slug}
                href={`#${subcategoryAnchor(subcategory.slug)}`}
                className="rounded-md bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {subcategory.name} ({concepts.length})
              </a>
            ))}
          </nav>
        </CardHeader>
      </Card>

      {groups.map(({ subcategory, concepts }) => {
        const Icon =
          SUBCATEGORY_ICONS[subcategory.icon as keyof typeof SUBCATEGORY_ICONS] ?? GitBranch;

        return (
          <section
            key={subcategory.slug}
            id={subcategoryAnchor(subcategory.slug)}
            className="scroll-mt-24 space-y-4"
          >
            <div className="flex items-start gap-3 border-b border-border/40 pb-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${accentColor}18` }}
              >
                <Icon className="size-4" style={{ color: accentColor }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{subcategory.name}</h2>
                <p className="text-sm text-muted-foreground">{subcategory.description}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {concepts.map((concept) => (
                <CliCommandCard key={concept.slug} concept={concept} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-center text-sm text-muted-foreground">
        Git เป็นเครื่องมือ local — GitHub เป็น hosting สำหรับ remote repo และ Pull Request
      </p>
    </div>
  );
}
