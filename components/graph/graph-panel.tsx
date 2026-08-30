import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllCategories, getConceptBySlug } from "@/lib/content/get-concepts";

interface GraphPanelProps {
  focusSlug: string | null;
  connectedSlugs: string[];
}

export function GraphPanel({ focusSlug, connectedSlugs }: GraphPanelProps) {
  if (!focusSlug) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="surface-muted p-4 text-sm text-muted-foreground"
      >
        คลิกโหนดเพื่อสำรวจความเชื่อมโยง หรือใช้รายการด้านล่างเพื่อนำทางด้วยคีย์บอร์ด
      </div>
    );
  }

  const concept = getConceptBySlug(focusSlug);
  if (!concept) {
    return null;
  }

  const category = getAllCategories().find((item) => item.slug === concept.category);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="surface-muted p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">{concept.title}</h3>
        {category && (
          <Badge variant="secondary" className="text-xs">
            {category.name}
          </Badge>
        )}
      </div>
      <p className="prose-content mt-1 text-sm line-clamp-2">{concept.summary}</p>

      {connectedSlugs.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            เชื่อมโยงกับ
          </p>
          <p className="mt-1 text-sm">{connectedSlugs.join(", ")}</p>
        </div>
      )}

      <Button className="mt-4" size="sm" render={<Link href={`/concepts/${focusSlug}`} />}>
        เปิด Concept
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
