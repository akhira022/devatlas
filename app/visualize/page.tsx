import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCategories } from "@/lib/content/get-concepts";
import { groupVisualizationsByCategory } from "@/lib/visualization/get-visualizations";

export const metadata: Metadata = {
  title: "Visualizations",
  description: "Interactive animations showing how protocols and concepts work",
};

export default function VisualizeIndexPage() {
  const groups = groupVisualizationsByCategory();
  const categories = getAllCategories();
  const categoryName = (slug: string) =>
    categories.find((category) => category.slug === slug)?.name ?? slug;

  return (
    <div className="container px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Visualizations</h1>
        <p className="mt-2 text-muted-foreground">
          ดูการทำงานของ protocol และ concept ทีละ step — กด Play แล้วตามทีละขั้น
        </p>
      </div>

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="mb-4 text-xl font-semibold">{categoryName(group.category)}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.visualizations.map((viz) => (
                <Link key={viz.slug} href={`/visualize/${viz.slug}`}>
                  <Card className="group h-full interactive-card">
                    <CardHeader>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {viz.protocol}
                        </span>
                        <Play className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <CardTitle as="h3" className="flex items-center justify-between text-base">
                        {viz.title}
                        <ArrowRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                      </CardTitle>
                      <CardDescription>{viz.description}</CardDescription>
                      <p className="text-xs text-muted-foreground">
                        {viz.steps.length} steps · concept: {viz.conceptSlug}
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
