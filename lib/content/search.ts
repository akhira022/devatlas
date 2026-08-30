import type { Concept } from "@/types/concept";

import { POPULAR_CONCEPT_SLUGS } from "@/lib/constants";

import { getAllCategories, getAllConcepts, getConceptBySlug } from "./get-concepts";
import { getAllDecisionTrees } from "./get-decision-trees";
import { getAllQuizConceptSlugs } from "./get-quizzes";

export interface SearchResult {
  type: "concept" | "category" | "page";
  slug: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface SearchSuggestion {
  label: string;
  query: string;
}

export function getSearchSuggestions(): SearchSuggestion[] {
  return POPULAR_CONCEPT_SLUGS.slice(0, 8).flatMap((slug) => {
    const concept = getConceptBySlug(slug);
    if (!concept) {
      return [];
    }

    return [{ label: concept.title, query: concept.title.toLowerCase() }];
  });
}

export function searchContent(query: string): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const conceptResults: SearchResult[] = getAllConcepts()
    .map((concept) => ({
      concept,
      score: scoreConcept(concept, normalized),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ concept }) => ({
      type: "concept" as const,
      slug: concept.slug,
      title: concept.title,
      subtitle: `${capitalize(concept.category)} · ${concept.difficulty}`,
      href: `/concepts/${concept.slug}`,
    }));

  const categoryResults: SearchResult[] = getAllCategories()
    .filter(
      (category) =>
        category.name.toLowerCase().includes(normalized) ||
        category.description.toLowerCase().includes(normalized),
    )
    .map((category) => ({
      type: "category" as const,
      slug: category.slug,
      title: category.name,
      subtitle: category.description,
      href: `/categories/${category.slug}`,
    }));

  const pageResults: SearchResult[] = [
    { title: "เส้นทางการเรียนรู้", subtitle: "Learning paths", href: "/learn", slug: "learn" },
    { title: "ช่วยเลือกเทคโนโลยี", subtitle: "Decision trees", href: "/decide", slug: "decide" },
    { title: "แบบทดสอบ", subtitle: "Reading comprehension quiz", href: "/quiz", slug: "quiz" },
    { title: "เปรียบเทียบ", subtitle: "Compare concepts", href: "/compare", slug: "compare" },
  ]
    .filter(
      (p) =>
        p.title.toLowerCase().includes(normalized) ||
        p.subtitle.toLowerCase().includes(normalized),
    )
    .map((p) => ({ type: "page" as const, ...p }));

  const treeResults: SearchResult[] = getAllDecisionTrees()
    .filter(
      (t) =>
        t.title.toLowerCase().includes(normalized) ||
        t.description.toLowerCase().includes(normalized),
    )
    .map((t) => ({
      type: "page" as const,
      slug: t.slug,
      title: t.title,
      subtitle: "Decision tree",
      href: `/decide/${t.slug}`,
    }));

  const quizSlugs = getAllQuizConceptSlugs();
  const quizResults: SearchResult[] = quizSlugs
    .map((slug) => getConceptBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => c !== undefined)
    .filter(
      (c) =>
        c.title.toLowerCase().includes(normalized) ||
        c.slug.includes(normalized) ||
        normalized.includes("quiz") ||
        normalized.includes("ทดสอบ"),
    )
    .slice(0, 3)
    .map((c) => ({
      type: "page" as const,
      slug: c.slug,
      title: `ทดสอบ: ${c.title}`,
      subtitle: "Quiz",
      href: `/concepts/${c.slug}#quiz`,
    }));

  return [...conceptResults, ...categoryResults, ...pageResults, ...treeResults, ...quizResults].slice(0, 10);
}

function scoreConcept(concept: Concept, query: string): number {
  let score = 0;

  if (concept.title.toLowerCase().includes(query)) score += 3;
  if (concept.slug.includes(query)) score += 3;
  if (concept.summary.toLowerCase().includes(query)) score += 2;
  if (concept.category.includes(query)) score += 1;
  if (concept.subcategory?.includes(query)) score += 2;
  if (concept.platform?.includes(query)) score += 1;
  if (concept.tags.some((tag) => tag.toLowerCase().includes(query))) score += 2;

  return score;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
