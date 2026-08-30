import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScenarioView } from "@/components/scenario/scenario-view";
import { getScenarioBySlug, getScenarioSlugs } from "@/lib/content/get-scenarios";
import { getVisualizationBySlug } from "@/lib/visualization/get-visualizations";

interface ScenarioPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getScenarioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ScenarioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = getScenarioBySlug(slug);

  if (!scenario) {
    return { title: "Scenario Not Found" };
  }

  return {
    title: scenario.title,
    description: scenario.description,
  };
}

export default async function ScenarioPage({ params }: ScenarioPageProps) {
  const { slug } = await params;
  const scenario = getScenarioBySlug(slug);

  if (!scenario) {
    notFound();
  }

  const visualization = getVisualizationBySlug(scenario.visualization);

  if (!visualization) {
    notFound();
  }

  return <ScenarioView scenario={scenario} visualization={visualization} />;
}
