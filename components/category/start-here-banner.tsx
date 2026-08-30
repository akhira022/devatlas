import Link from "next/link";
import { Sparkles } from "lucide-react";

import { getConceptBySlug } from "@/lib/content/get-concepts";

interface StartHereBannerProps {
  slugs: string[];
  categoryName: string;
}

export function StartHereBanner({ slugs, categoryName }: StartHereBannerProps) {
  const concepts = slugs
    .map((slug) => getConceptBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  if (concepts.length === 0) return null;

  return (
    <div className="callout-accent mb-8 rounded-xl border p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
        <Sparkles className="size-4" />
        เริ่มที่นี่ — {categoryName}
      </div>
      <div className="flex flex-wrap gap-2">
        {concepts.map((concept, i) => (
          <Link
            key={concept.slug}
            href={`/concepts/${concept.slug}`}
            className="flex items-center gap-2 rounded-lg border border-border/70 bg-background px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent/60"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {i + 1}
            </span>
            {concept.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
