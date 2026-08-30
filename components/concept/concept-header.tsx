import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Concept } from "@/types/concept";
import {
  getCategoryBySlug,
  getSubcategoryForConcept,
  CLI_PLATFORM_LABELS,
} from "@/lib/content/get-concepts";
import {
  DIFFICULTY_COLORS,
  getDifficultyLabel,
} from "@/lib/difficulty-labels";

interface ConceptHeaderProps {
  concept: Concept;
}

export function ConceptHeader({ concept }: ConceptHeaderProps) {
  const category = getCategoryBySlug(concept.category);
  const subcategory = getSubcategoryForConcept(concept);

  const platformLabel = concept.platform ? CLI_PLATFORM_LABELS[concept.platform] : undefined;

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          {
            label: category?.name ?? concept.category,
            href: `/categories/${concept.category}`,
          },
          { label: concept.title },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{concept.title}</h1>
        {concept.fullName && (
          <p className="prose-lead mt-1">{concept.fullName}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className={DIFFICULTY_COLORS[concept.difficulty]}>
          {getDifficultyLabel(concept.difficulty)}
        </Badge>
        {category && (
          <Badge variant="outline" style={{ borderColor: `${category.color}40`, color: category.color }}>
            {category.name}
          </Badge>
        )}
        {subcategory && <Badge variant="secondary">{subcategory.name}</Badge>}
        {platformLabel && <Badge variant="outline">{platformLabel}</Badge>}
      </div>

      <p className="prose-content max-w-2xl">{concept.summary}</p>
    </div>
  );
}
