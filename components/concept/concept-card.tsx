import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDifficultyLabel } from "@/lib/difficulty-labels";
import type { Concept } from "@/types/concept";

interface ConceptCardProps {
  concept: Concept;
}

export function ConceptCard({ concept }: ConceptCardProps) {
  return (
    <Link href={`/concepts/${concept.slug}`}>
      <Card className="h-full interactive-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle as="h3" className="text-base">
              {concept.title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {getDifficultyLabel(concept.difficulty)}
            </Badge>
          </div>
          {concept.fullName && (
            <p className="text-xs text-muted-foreground">{concept.fullName}</p>
          )}
          <CardDescription className="line-clamp-2">{concept.summary}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
