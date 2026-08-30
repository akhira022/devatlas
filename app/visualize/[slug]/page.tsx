import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { FlowPlayer } from "@/components/visualization/flow-player";
import { Button } from "@/components/ui/button";
import {
  getVisualizationBySlug,
  getVisualizationSlugs,
} from "@/lib/visualization/get-visualizations";

interface VisualizePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getVisualizationSlugs().map((slug) => ({ slug }));
}

export default async function VisualizePage({ params }: VisualizePageProps) {
  const { slug } = await params;
  const visualization = getVisualizationBySlug(slug);

  if (!visualization) {
    notFound();
  }

  return (
    <div className="container max-w-4xl px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        render={<Link href={`/concepts/${visualization.conceptSlug}`} />}
      >
        <ArrowLeft className="size-4" />
        Back to {visualization.conceptSlug.toUpperCase()}
      </Button>

      <h1 className="text-3xl font-bold">{visualization.title}</h1>
      <p className="mt-2 text-muted-foreground">{visualization.description}</p>

      <div className="mt-8">
        <FlowPlayer visualization={visualization} />
      </div>
    </div>
  );
}
