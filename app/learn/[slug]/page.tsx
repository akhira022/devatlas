import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";

import { LearningPathView } from "@/components/learn/learning-path-view";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  getLearningPathBySlug,
  getLearningPathSlugs,
} from "@/lib/content/get-learning-paths";
import { DIFFICULTY_COLORS, getDifficultyLabel } from "@/lib/difficulty-labels";

interface LearnPathPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getLearningPathSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LearnPathPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = getLearningPathBySlug(slug);
  if (!path) return { title: "Not Found" };
  return { title: path.title, description: path.description };
}

export default async function LearnPathPage({ params }: LearnPathPageProps) {
  const { slug } = await params;
  const path = getLearningPathBySlug(slug);

  if (!path) notFound();

  return (
    <div className="container max-w-3xl px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "เส้นทางการเรียน", href: "/learn" },
          { label: path.title },
        ]}
      />

      <div className="mt-6 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{path.title}</h1>
        <p className="prose-content max-w-2xl text-muted-foreground">{path.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge className={DIFFICULTY_COLORS[path.difficulty]}>
            {getDifficultyLabel(path.difficulty)}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="size-3" />
            ~{path.estimatedMinutes} นาที
          </Badge>
          <Badge variant="secondary">{path.steps.length} บทเรียน</Badge>
        </div>
      </div>

      <div className="mt-10">
        <LearningPathView path={path} />
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-primary">
          ← ดูเส้นทางอื่น
        </Link>
      </p>
    </div>
  );
}
