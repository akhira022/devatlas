import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftRight, ArrowRight } from "lucide-react";

import { GitConceptHeader } from "@/components/git/git-concept-header";
import { CliConceptHeader } from "@/components/cli/cli-concept-header";
import { CliSectionBlock } from "@/components/cli/cli-section-block";
import { ConceptHeader } from "@/components/concept/concept-header";
import { ConceptQuizBlock } from "@/components/concept/concept-quiz";
import { ConceptSectionBlock } from "@/components/concept/concept-section";
import { ConceptVisualization } from "@/components/concept/concept-visualization";
import { PrerequisitesBanner } from "@/components/concept/prerequisites-banner";
import { RelatedConcepts } from "@/components/concept/related-concepts";
import { Button } from "@/components/ui/button";
import { getComparisonsForConcept } from "@/lib/content/get-comparisons";
import {
  getConceptBySlug,
  getConceptSlugs,
  getRelatedConcepts,
  isCommandCategory,
} from "@/lib/content/get-concepts";
import { getQuizForConcept } from "@/lib/content/get-quizzes";
import { getVisualizationBySlug } from "@/lib/visualization/get-visualizations";

interface ConceptPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getConceptSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ConceptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) {
    return { title: "Concept Not Found" };
  }

  return {
    title: concept.title,
    description: concept.summary,
  };
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) {
    notFound();
  }

  const related = getRelatedConcepts(slug);
  const isCommand = isCommandCategory(concept.category);
  const visualization = concept.visualization
    ? getVisualizationBySlug(concept.visualization)
    : undefined;
  const quiz = getQuizForConcept(slug);
  const comparisons = getComparisonsForConcept(slug);

  const header =
    concept.category === "git-github" ? (
      <GitConceptHeader concept={concept} />
    ) : concept.category === "cli" ? (
      <CliConceptHeader concept={concept} />
    ) : (
      <ConceptHeader concept={concept} />
    );

  return (
    <div className={`container px-4 py-10 ${isCommand ? "max-w-4xl" : "max-w-3xl"}`}>
      {header}

      {concept.prerequisites && concept.prerequisites.length > 0 && (
        <div className="mt-6">
          <PrerequisitesBanner slugs={concept.prerequisites} />
        </div>
      )}

      {visualization && (
        <div className="mt-8">
          <ConceptVisualization visualization={visualization} />
        </div>
      )}

      <div className="mt-10 space-y-5">
        {concept.sections.map((section, index) =>
          isCommand ? (
            <CliSectionBlock key={`${section.type}-${index}`} section={section} />
          ) : (
            <ConceptSectionBlock key={`${section.type}-${index}`} section={section} />
          ),
        )}

        {quiz && <ConceptQuizBlock quiz={quiz} />}
      </div>

      <div className="mt-10 space-y-6">
        {comparisons.length > 0 && (
          <div className="surface-muted p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <ArrowLeftRight className="size-4" />
              เปรียบเทียบที่เกี่ยวข้อง
            </h3>
            <div className="flex flex-wrap gap-2">
              {comparisons.map((c) => (
                <Button
                  key={c.slug}
                  variant="outline"
                  size="sm"
                  render={<Link href={`/compare/${c.slug}`} />}
                >
                  {c.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        <RelatedConcepts concepts={related} />

        {visualization && (
          <Button variant="outline" render={<Link href={`/visualize/${visualization.slug}`} />}>
            Open Full Visualization
            <ArrowRight className="size-4" />
          </Button>
        )}

        <Button variant="ghost" render={<Link href={`/graph?focus=${concept.slug}`} />}>
          View in Knowledge Graph
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
