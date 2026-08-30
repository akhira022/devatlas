import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DecisionTreePlayer } from "@/components/decide/decision-tree-player";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  getDecisionTreeBySlug,
  getDecisionTreeSlugs,
} from "@/lib/content/get-decision-trees";

interface DecideDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getDecisionTreeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DecideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tree = getDecisionTreeBySlug(slug);
  if (!tree) return { title: "Not Found" };
  return { title: tree.title, description: tree.description };
}

export default async function DecideDetailPage({ params }: DecideDetailPageProps) {
  const { slug } = await params;
  const tree = getDecisionTreeBySlug(slug);

  if (!tree) notFound();

  return (
    <div className="container max-w-2xl px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "ช่วยเลือก", href: "/decide" },
          { label: tree.title },
        ]}
      />

      <div className="mt-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{tree.title}</h1>
        <p className="text-muted-foreground">{tree.description}</p>
      </div>

      <div className="mt-10">
        <DecisionTreePlayer tree={tree} />
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        <Link href="/decide" className="hover:text-primary">
          ← ดูหัวข้ออื่น
        </Link>
      </p>
    </div>
  );
}
