import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Scenario, ScenarioStep } from "@/types/scenario";

interface ScenarioStepsProps {
  steps: ScenarioStep[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function ScenarioSteps({ steps, currentStep, onStepClick }: ScenarioStepsProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Step-by-Step</h2>
      <ol className="space-y-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <li key={step.order}>
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-colors",
                  isActive && "border-primary bg-primary/5",
                  isDone && !isActive && "border-border/40 opacity-70",
                  !isActive && !isDone && "border-border/60 hover:bg-accent/30",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                      isActive && "bg-primary text-primary-foreground",
                      isDone && !isActive && "bg-muted text-muted-foreground",
                      !isActive && !isDone && "bg-muted text-muted-foreground",
                    )}
                  >
                    {isDone ? "✓" : step.order}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{step.title}</p>
                    <p className="prose-content mt-1 text-sm">{step.description}</p>
                    {step.conceptSlug && (
                      <Link
                        href={`/concepts/${step.conceptSlug}`}
                        onClick={(event) => event.stopPropagation()}
                        className="mt-2 inline-block"
                      >
                        <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground">
                          {step.conceptSlug}
                        </Badge>
                      </Link>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

interface ScenarioConceptChipsProps {
  scenario: Scenario;
}

export function ScenarioConceptChips({ scenario }: ScenarioConceptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {scenario.concepts.map((slug) => (
        <Link key={slug} href={`/concepts/${slug}`}>
          <Badge variant="secondary" className="capitalize hover:bg-primary hover:text-primary-foreground">
            {slug}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
