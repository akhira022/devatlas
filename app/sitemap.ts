import type { MetadataRoute } from "next";

import { getAllCategories, getConceptSlugs } from "@/lib/content/get-concepts";
import { getComparisonSlugs } from "@/lib/content/get-comparisons";
import { getDecisionTreeSlugs } from "@/lib/content/get-decision-trees";
import { getLearningPathSlugs } from "@/lib/content/get-learning-paths";
import { getScenarioSlugs } from "@/lib/content/get-scenarios";
import { getVisualizationSlugs } from "@/lib/visualization/get-visualizations";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-atlas.local";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/concepts",
    "/learn",
    "/compare",
    "/decide",
    "/quiz",
    "/visualize",
    "/scenarios",
    "/graph",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const categories = getAllCategories().map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const concepts = getConceptSlugs().map((slug) => ({
    url: `${BASE_URL}/concepts/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const visualizations = getVisualizationSlugs().map((slug) => ({
    url: `${BASE_URL}/visualize/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const scenarios = getScenarioSlugs().map((slug) => ({
    url: `${BASE_URL}/scenarios/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const learningPaths = getLearningPathSlugs().map((slug) => ({
    url: `${BASE_URL}/learn/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const comparisons = getComparisonSlugs().map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const decisionTrees = getDecisionTreeSlugs().map((slug) => ({
    url: `${BASE_URL}/decide/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categories,
    ...concepts,
    ...visualizations,
    ...scenarios,
    ...learningPaths,
    ...comparisons,
    ...decisionTrees,
  ];
}
