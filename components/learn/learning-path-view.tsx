import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { getConceptBySlug } from "@/lib/content/get-concepts";
import type { LearningPath } from "@/types/learning-path";
import { Button } from "@/components/ui/button";

interface LearningPathViewProps {
  path: LearningPath;
}

export function LearningPathView({ path }: LearningPathViewProps) {
  return (
    <div className="space-y-6">
      <ol className="space-y-3">
        {path.steps
          .sort((a, b) => a.order - b.order)
          .map((step, index) => {
            const concept = getConceptBySlug(step.conceptSlug);
            if (!concept) return null;

            return (
              <li key={step.order}>
                <Link
                  href={`/concepts/${step.conceptSlug}`}
                  className="surface-muted group interactive-card flex gap-4 p-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold group-hover:text-primary">
                        {step.title ?? concept.title}
                      </h3>
                      <CheckCircle2 className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {step.note ?? concept.summary}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
      </ol>

      {path.scenarioSlug && (
        <div className="callout-accent rounded-xl border p-5">
          <h3 className="font-semibold">ทดสอบความเข้าใจด้วย Scenario</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            ดู flow จริงตั้งแต่ต้นจนจบหลังเรียนครบทุกบท
          </p>
          <Button className="mt-3" render={<Link href={`/scenarios/${path.scenarioSlug}`} />}>
            ไปที่ Scenario →
          </Button>
        </div>
      )}
    </div>
  );
}
