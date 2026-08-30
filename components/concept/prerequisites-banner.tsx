"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

import { getConceptBySlug } from "@/lib/content/get-concepts";

interface PrerequisitesBannerProps {
  slugs: string[];
}

export function PrerequisitesBanner({ slugs }: PrerequisitesBannerProps) {
  const concepts = slugs
    .map((slug) => getConceptBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  if (concepts.length === 0) return null;

  return (
    <div className="callout-hint rounded-xl border p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        <BookOpen className="size-4" />
        อ่านก่อนหน้านี้
      </div>
      <div className="flex flex-wrap gap-2">
        {concepts.map((concept) => (
          <Link
            key={concept.slug}
            href={`/concepts/${concept.slug}`}
            className="rounded-md border border-border/70 bg-background px-3 py-1 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent/60"
          >
            {concept.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
