import { GitBranch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Concept } from "@/types/concept";
import { getCategoryBySlug, getSubcategoryForConcept } from "@/lib/content/get-concepts";
import {
  DIFFICULTY_COLORS,
  getDifficultyLabel,
} from "@/lib/difficulty-labels";

interface GitConceptHeaderProps {
  concept: Concept;
}

export function GitConceptHeader({ concept }: GitConceptHeaderProps) {
  const category = getCategoryBySlug(concept.category);
  const subcategory = getSubcategoryForConcept(concept);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Git & GitHub", href: "/categories/git-github" },
    ...(subcategory
      ? [
          {
            label: subcategory.name,
            href: `/categories/git-github#git-${subcategory.slug}`,
          },
        ]
      : []),
    { label: concept.title, mono: true },
  ];

  return (
    <div className="space-y-5">
      <Breadcrumb items={breadcrumbItems} />

      <div className="terminal-panel">
        <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider opacity-60">
          <GitBranch className="size-3.5" aria-hidden="true" />
          Git command
        </p>
        <h1 className="font-mono text-2xl font-bold tracking-tight md:text-3xl">
          {concept.slug === "git" ? (
            <>
              <span className="opacity-50">$ </span>git
            </>
          ) : concept.slug === "github-pr" || concept.slug === "gh-cli" ? (
            concept.title
          ) : (
            <>
              <span className="opacity-50">$ </span>git {concept.title}
            </>
          )}
        </h1>
        {concept.fullName && (
          <p className="mt-2 text-sm opacity-60">{concept.fullName}</p>
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
      </div>

      <p className="prose-content max-w-2xl text-base">{concept.summary}</p>
    </div>
  );
}
