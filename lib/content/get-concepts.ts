import categoriesData from "@/data/categories.json";
import cliSubcategoriesData from "@/data/cli-subcategories.json";
import gitSubcategoriesData from "@/data/git-subcategories.json";
import hardwareSubcategoriesData from "@/data/hardware-subcategories.json";
import { concepts } from "@/data/concepts";
import relationsData from "@/data/relations.json";
import type { Category, CliSubcategory, Concept, ConceptRelation } from "@/types/concept";

export function getAllConcepts(): Concept[] {
  return [...concepts].sort((a, b) => a.title.localeCompare(b.title));
}

export function getConceptBySlug(slug: string): Concept | undefined {
  return getAllConcepts().find((concept) => concept.slug === slug);
}

export function getConceptSlugs(): string[] {
  return getAllConcepts().map((concept) => concept.slug);
}

export function getConceptsByCategory(categorySlug: string): Concept[] {
  return getAllConcepts().filter((concept) => concept.category === categorySlug);
}

export function getCliSubcategories(): CliSubcategory[] {
  return [...(cliSubcategoriesData as CliSubcategory[])].sort((a, b) => a.order - b.order);
}

export function getGitSubcategories(): CliSubcategory[] {
  return [...(gitSubcategoriesData as CliSubcategory[])].sort((a, b) => a.order - b.order);
}

export function getHardwareSubcategories(): CliSubcategory[] {
  return [...(hardwareSubcategoriesData as CliSubcategory[])].sort((a, b) => a.order - b.order);
}

export function getSubcategoryForConcept(concept: Concept): CliSubcategory | undefined {
  if (!concept.subcategory) {
    return undefined;
  }

  if (concept.category === "cli") {
    return getCliSubcategories().find(
      (item) =>
        item.slug === concept.subcategory &&
        item.platform === (concept.platform ?? "unix"),
    );
  }

  if (concept.category === "git-github") {
    return getGitSubcategories().find((item) => item.slug === concept.subcategory);
  }

  if (concept.category === "hardware") {
    return getHardwareSubcategories().find((item) => item.slug === concept.subcategory);
  }

  return undefined;
}

export function groupGitConceptsBySubcategory(): Array<{
  subcategory: CliSubcategory;
  concepts: Concept[];
}> {
  return getGitSubcategories()
    .map((subcategory) => ({
      subcategory,
      concepts: getConceptsByCategory("git-github")
        .filter((concept) => concept.subcategory === subcategory.slug)
        .sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .filter((group) => group.concepts.length > 0);
}

export function groupHardwareConceptsBySubcategory(): Array<{
  subcategory: CliSubcategory;
  concepts: Concept[];
}> {
  return getHardwareSubcategories()
    .map((subcategory) => ({
      subcategory,
      concepts: getConceptsByCategory("hardware")
        .filter((concept) => concept.subcategory === subcategory.slug)
        .sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .filter((group) => group.concepts.length > 0);
}

function sortDataStructureConcepts(concepts: Concept[]): Concept[] {
  return [...concepts].sort((a, b) => {
    if (a.slug === "data-structure") {
      return -1;
    }
    if (b.slug === "data-structure") {
      return 1;
    }
    return a.title.localeCompare(b.title);
  });
}

export function getProgrammingConceptGroups(): {
  dataStructures: Concept[];
  core: Concept[];
} {
  const all = getConceptsByCategory("programming");
  return {
    dataStructures: sortDataStructureConcepts(
      all.filter((concept) => concept.subcategory === "data-structure"),
    ),
    core: all.filter((concept) => concept.subcategory !== "data-structure"),
  };
}

export const COMMAND_CATEGORIES = ["cli", "git-github"] as const;

export function isCommandCategory(categorySlug: string): boolean {
  return COMMAND_CATEGORIES.includes(categorySlug as (typeof COMMAND_CATEGORIES)[number]);
}

export function getConceptsBySubcategory(
  categorySlug: string,
  subcategorySlug: string,
  platform: string,
): Concept[] {
  return getConceptsByCategory(categorySlug)
    .filter(
      (concept) => concept.subcategory === subcategorySlug && concept.platform === platform,
    )
    .sort((a, b) => a.title.localeCompare(b.title));
}

export const CLI_PLATFORM_LABELS: Record<string, string> = {
  unix: "Unix / Linux / macOS",
  windows: "Windows & PowerShell",
};

export function groupCliConceptsByPlatform(categorySlug: string): Array<{
  platform: string;
  label: string;
  groups: Array<{ subcategory: CliSubcategory; concepts: Concept[] }>;
}> {
  const platformOrder = ["unix", "windows"];

  return platformOrder
    .map((platform) => ({
      platform,
      label: CLI_PLATFORM_LABELS[platform] ?? platform,
      groups: getCliSubcategories()
        .filter((subcategory) => subcategory.platform === platform)
        .map((subcategory) => ({
          subcategory,
          concepts: getConceptsBySubcategory(categorySlug, subcategory.slug, platform),
        }))
        .filter((group) => group.concepts.length > 0),
    }))
    .filter((entry) => entry.groups.length > 0);
}

export function groupConceptsBySubcategory(categorySlug: string): Array<{
  subcategory: CliSubcategory;
  concepts: Concept[];
}> {
  return getCliSubcategories()
    .map((subcategory) => ({
      subcategory,
      concepts: getConceptsBySubcategory(categorySlug, subcategory.slug, subcategory.platform),
    }))
    .filter((group) => group.concepts.length > 0);
}

export function getAllCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getAllCategories().find((category) => category.slug === slug);
}

export function getAllRelations(): ConceptRelation[] {
  return relationsData as ConceptRelation[];
}

export function getRelatedConcepts(slug: string): Concept[] {
  const concept = getConceptBySlug(slug);
  if (!concept) {
    return [];
  }

  const allConcepts = getAllConcepts();
  return concept.related
    .map((relatedSlug) => allConcepts.find((item) => item.slug === relatedSlug))
    .filter((item): item is Concept => Boolean(item));
}

export function getRelationsForConcept(slug: string): ConceptRelation[] {
  return getAllRelations().filter(
    (relation) => relation.source === slug || relation.target === slug,
  );
}
