import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Concept } from "@/types/concept";

interface RelatedConceptsProps {
  concepts: Concept[];
}

export function RelatedConcepts({ concepts }: RelatedConceptsProps) {
  if (concepts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Related Concepts</h2>
      <div className="flex flex-wrap gap-2">
        {concepts.map((concept) => (
          <Link key={concept.slug} href={`/concepts/${concept.slug}`}>
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {concept.title}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
