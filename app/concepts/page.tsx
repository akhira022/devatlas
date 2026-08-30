import type { Metadata } from "next";

import { ConceptCard } from "@/components/concept/concept-card";
import { getAllConcepts } from "@/lib/content/get-concepts";

export const metadata: Metadata = {
  title: "All Concepts",
  description: "Browse all technology concepts in DEV ATLAS",
};

export default function ConceptsPage() {
  const concepts = getAllConcepts();

  return (
    <div className="container px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Concepts</h1>
        <p className="mt-2 text-muted-foreground">
          Explore {concepts.length} technology concepts
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {concepts.map((concept) => (
          <ConceptCard key={concept.slug} concept={concept} />
        ))}
      </div>
    </div>
  );
}
