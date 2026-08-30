import Link from "next/link";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";

import { CategoryStartHere } from "@/components/category/category-start-here";
import { GitCategoryView } from "@/components/git/git-category-view";
import { HardwareCategoryView } from "@/components/hardware/hardware-category-view";
import { CliCategoryView } from "@/components/cli/cli-category-view";
import { ConceptCard } from "@/components/concept/concept-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllCategories,
  getCategoryBySlug,
  getConceptsByCategory,
  getProgrammingConceptGroups,
  groupCliConceptsByPlatform,
  groupGitConceptsBySubcategory,
  groupHardwareConceptsBySubcategory,
} from "@/lib/content/get-concepts";
import { getNetworkVisualizations, getProgrammingVisualizations } from "@/lib/visualization/get-visualizations";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const concepts = getConceptsByCategory(categorySlug);
  const programmingGroups =
    categorySlug === "programming" ? getProgrammingConceptGroups() : null;
  const cliPlatforms = categorySlug === "cli" ? groupCliConceptsByPlatform(categorySlug) : [];
  const gitGroups = categorySlug === "git-github" ? groupGitConceptsBySubcategory() : [];
  const hardwareGroups = categorySlug === "hardware" ? groupHardwareConceptsBySubcategory() : [];
  const categoryFlows =
    categorySlug === "network"
      ? getNetworkVisualizations()
      : categorySlug === "programming"
        ? getProgrammingVisualizations()
        : [];

  return (
    <div className="container px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: category.color }}>
          {category.name}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
        <CategoryStartHere category={category} />
        {categorySlug === "cli" && (
          <p className="mt-2 text-sm text-muted-foreground">
            {concepts.length} คำสั่ง · แยก Unix/Linux/macOS และ Windows/PowerShell
          </p>
        )}
        {categorySlug === "git-github" && (
          <p className="mt-2 text-sm text-muted-foreground">
            {concepts.length} หัวข้อ · Git commands และ GitHub workflow
          </p>
        )}
        {categorySlug === "hardware" && (
          <p className="mt-2 text-sm text-muted-foreground">
            {concepts.length} หัวข้อ · ชิป หน่วยความจำ อุปกรณ์ และเซิร์ฟเวอร์
          </p>
        )}
        {categorySlug === "programming" && programmingGroups && (
          <p className="mt-2 text-sm text-muted-foreground">
            {concepts.length} หัวข้อ · รวม Data Structure {programmingGroups.dataStructures.length}{" "}
            เรื่อง
          </p>
        )}
        {categorySlug !== "cli" &&
          categorySlug !== "git-github" &&
          categorySlug !== "programming" &&
          categorySlug !== "hardware" && (
          <p className="mt-1 text-sm text-muted-foreground">{concepts.length} concepts</p>
        )}
      </div>

      {categoryFlows.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">
            {categorySlug === "network" ? "🎬 Protocol Animations" : "🎬 Concept Animations"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryFlows.map((viz) => (
              <Link key={viz.slug} href={`/visualize/${viz.slug}`}>
                <Card className="interactive-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {viz.protocol}
                      </span>
                      <Play className="size-4 text-muted-foreground" />
                    </div>
                    <CardTitle as="h3" className="text-sm">{viz.title}</CardTitle>
                    <CardDescription className="text-xs">{viz.steps.length} steps</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categorySlug === "git-github" && gitGroups.length > 0 ? (
        <GitCategoryView
          groups={gitGroups}
          accentColor={category.color}
          totalCommands={concepts.length}
        />
      ) : categorySlug === "hardware" && hardwareGroups.length > 0 ? (
        <HardwareCategoryView
          groups={hardwareGroups}
          accentColor={category.color}
          totalConcepts={concepts.length}
        />
      ) : categorySlug === "cli" && cliPlatforms.length > 0 ? (
        <CliCategoryView
          platforms={cliPlatforms}
          accentColor={category.color}
          totalCommands={concepts.length}
        />
      ) : categorySlug === "programming" && programmingGroups ? (
        <div className="space-y-10">
          {programmingGroups.dataStructures.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">📊 Data Structures</h2>
              <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
                โครงสร้างข้อมูลพื้นฐาน — เลือกให้เหมาะกับ operation ที่ทำบ่อย
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {programmingGroups.dataStructures.map((concept) => (
                  <ConceptCard key={concept.slug} concept={concept} />
                ))}
              </div>
            </section>
          )}
          {programmingGroups.core.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">💻 Core Concepts</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {programmingGroups.core.map((concept) => (
                  <ConceptCard key={concept.slug} concept={concept} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : concepts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {concepts.map((concept) => (
            <ConceptCard key={concept.slug} concept={concept} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
          <p>No concepts in this category yet.</p>
          <p className="mt-1 text-sm">Coming soon in the next sprint.</p>
        </div>
      )}
    </div>
  );
}
