import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getAllConcepts } from "@/lib/content/get-concepts";
import { POPULAR_CONCEPT_SLUGS } from "@/lib/constants";

export function PopularConcepts() {
  const concepts = getAllConcepts();
  const popular = POPULAR_CONCEPT_SLUGS.map((slug) =>
    concepts.find((concept) => concept.slug === slug),
  ).filter(Boolean);

  const displayConcepts = popular.length > 0 ? popular : concepts;

  return (
    <section className="container px-4 py-12">
      <h2 className="mb-6 text-xl font-semibold">Concept ยอดนิยม</h2>
      <div className="flex flex-wrap gap-2">
        {displayConcepts.map((concept) => (
          <Link key={concept!.slug} href={`/concepts/${concept!.slug}`}>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {concept!.title}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
