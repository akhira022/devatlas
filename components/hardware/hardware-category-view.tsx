import {
  Cpu,
  Microchip,
  Network,
  Plug,
  Power,
  Server,
  Shield,
} from "lucide-react";

import { ConceptCard } from "@/components/concept/concept-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CliSubcategory, Concept } from "@/types/concept";

const SUBCATEGORY_ICONS = {
  cpu: Cpu,
  power: Power,
  network: Network,
  chip: Microchip,
  plug: Plug,
  server: Server,
  shield: Shield,
} as const;

interface HardwareCategoryViewProps {
  groups: Array<{ subcategory: CliSubcategory; concepts: Concept[] }>;
  accentColor: string;
  totalConcepts: number;
}

function subcategoryAnchor(slug: string) {
  return `hardware-${slug}`;
}

export function HardwareCategoryView({
  groups,
  accentColor,
  totalConcepts,
}: HardwareCategoryViewProps) {
  return (
    <div className="space-y-10">
      <Card className="surface-muted border-border/60">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle as="h2" className="text-lg">Hardware Knowledge Map</CardTitle>
              <CardDescription className="mt-1 max-w-2xl">
                ชิป หน่วยความจำ อุปกรณ์เครือข่าย และเซิร์ฟเวอร์ — สิ่งที่ซอฟต์แวร์ของคุณทำงานอยู่
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {totalConcepts} หัวข้อ
            </Badge>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="ข้ามไปยังส่วนฮาร์ดแวร์">
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
          SUBCATEGORY_ICONS[subcategory.icon as keyof typeof SUBCATEGORY_ICONS] ?? Cpu;

        return (
          <section key={subcategory.slug} id={subcategoryAnchor(subcategory.slug)}>
            <div className="mb-4 flex items-center gap-2">
              <Icon className="size-5" style={{ color: accentColor }} />
              <h2 className="text-lg font-semibold">{subcategory.name}</h2>
            </div>
            <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
              {subcategory.description}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {concepts.map((concept) => (
                <ConceptCard key={concept.slug} concept={concept} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
