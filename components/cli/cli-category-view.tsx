import Link from "next/link";
import { FileText, Folder, Globe, Package, Terminal } from "lucide-react";

import { CliCommandCard } from "@/components/cli/cli-command-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CliSubcategory, Concept } from "@/types/concept";

const SUBCATEGORY_ICONS = {
  folder: Folder,
  "file-text": FileText,
  globe: Globe,
  package: Package,
} as const;

interface CliPlatformGroup {
  platform: string;
  label: string;
  groups: Array<{
    subcategory: CliSubcategory;
    concepts: Concept[];
  }>;
}

interface CliCategoryViewProps {
  platforms: CliPlatformGroup[];
  accentColor: string;
  totalCommands: number;
}

function platformAnchor(platform: string) {
  return `platform-${platform}`;
}

function subcategoryAnchor(platform: string, slug: string) {
  return `${platform}-${slug}`;
}

export function CliCategoryView({ platforms, accentColor, totalCommands }: CliCategoryViewProps) {
  return (
    <div className="space-y-10">
      <Card className="surface-muted border-border/60">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle as="h2" className="text-lg">คู่มือคำสั่ง CLI</CardTitle>
              <CardDescription className="mt-1 max-w-2xl">
                แยกตามแพลตฟอร์มและประเภท — แต่ละคำสั่งมี syntax, ตัวอย่าง และข้อควรระวัง
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {totalCommands} คำสั่ง
            </Badge>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="ข้ามไปยังแพลตฟอร์ม">
            {platforms.map(({ platform, label, groups }) => {
              const count = groups.reduce((sum, group) => sum + group.concepts.length, 0);

              return (
                <a
                  key={platform}
                  href={`#${platformAnchor(platform)}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent/60"
                >
                  <Terminal className="size-4" style={{ color: accentColor }} />
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">({count})</span>
                </a>
              );
            })}
          </nav>
        </CardHeader>
      </Card>

      {platforms.map(({ platform, label, groups }) => {
        const platformCount = groups.reduce((sum, group) => sum + group.concepts.length, 0);

        return (
          <section
            key={platform}
            id={platformAnchor(platform)}
            className="surface-subtle scroll-mt-24 space-y-8 p-5 sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${accentColor}18` }}
                >
                  <Terminal className="size-5" style={{ color: accentColor }} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{label}</h2>
                  <p className="text-sm text-muted-foreground">{platformCount} คำสั่ง</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {groups.map(({ subcategory, concepts }) => (
                  <a
                    key={subcategory.slug}
                    href={`#${subcategoryAnchor(platform, subcategory.slug)}`}
                    className="rounded-md bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {subcategory.name.split(" ")[0]} ({concepts.length})
                  </a>
                ))}
              </div>
            </div>

            {groups.map(({ subcategory, concepts: groupConcepts }) => {
              const Icon =
                SUBCATEGORY_ICONS[subcategory.icon as keyof typeof SUBCATEGORY_ICONS] ?? Terminal;

              return (
                <section
                  key={`${platform}-${subcategory.slug}`}
                  id={subcategoryAnchor(platform, subcategory.slug)}
                  className="scroll-mt-24 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${accentColor}15` }}
                    >
                      <Icon className="size-4" style={{ color: accentColor }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{subcategory.name}</h3>
                      <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {groupConcepts.map((concept) => (
                      <CliCommandCard key={concept.slug} concept={concept} />
                    ))}
                  </div>
                </section>
              );
            })}
          </section>
        );
      })}

      <p className="text-center text-sm text-muted-foreground">
        Unix และ Windows ใช้คำสั่งต่างกัน — ดู{" "}
        <Link href="/concepts/cd" className="text-primary hover:underline">
          cd
        </Link>{" "}
        vs{" "}
        <Link href="/concepts/win-cd" className="text-primary hover:underline">
          cd (Windows)
        </Link>{" "}
        เป็นตัวอย่าง
      </p>
    </div>
  );
}
