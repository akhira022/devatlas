import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Comparison } from "@/types/comparison";

interface ComparisonCardProps {
  comparison: Comparison;
}

export function ComparisonCard({ comparison }: ComparisonCardProps) {
  return (
    <Link href={`/compare/${comparison.slug}`}>
      <Card className="group h-full interactive-card">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <ArrowLeftRight className="size-5 text-primary" />
          </div>
          <CardTitle as="h3" className="flex items-start justify-between gap-2 text-base">
            {comparison.title}
          </CardTitle>
          <CardDescription>{comparison.description}</CardDescription>
          <p className="text-xs text-muted-foreground">
            {comparison.items.map((i) => i.name).join(" vs ")}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
