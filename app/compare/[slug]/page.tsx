import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ComparisonTable } from "@/components/compare/comparison-table";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getComparisonBySlug, getComparisonSlugs } from "@/lib/content/get-comparisons";

interface CompareDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CompareDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) return { title: "Not Found" };
  return { title: comparison.title, description: comparison.description };
}

export default async function CompareDetailPage({ params }: CompareDetailPageProps) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) notFound();

  return (
    <div className="container max-w-4xl px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "เปรียบเทียบ", href: "/compare" },
          { label: comparison.title },
        ]}
      />

      <div className="mt-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{comparison.title}</h1>
        <p className="prose-content max-w-2xl text-muted-foreground">{comparison.description}</p>
      </div>

      <div className="mt-10">
        <ComparisonTable comparison={comparison} />
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        <Link href="/compare" className="hover:text-primary">
          ← ดูการเปรียบเทียบอื่น
        </Link>
      </p>
    </div>
  );
}
