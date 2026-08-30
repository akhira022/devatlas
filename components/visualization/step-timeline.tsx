import type { FlowStep } from "@/types/visualization";

interface StepTimelineProps {
  steps: FlowStep[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function StepTimeline({ steps, currentStep, onStepClick }: StepTimelineProps) {
  return (
    <div
      className="flex items-center gap-1 overflow-x-auto pb-1"
      role="list"
      aria-label="ไทม์ไลน์ขั้นตอน"
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isDone = index < currentStep;

        return (
          <div key={step.id} className="flex items-center" role="listitem">
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              className="group flex min-h-11 min-w-11 flex-col items-center gap-1"
              aria-label={`ขั้นตอน ${index + 1}: ${step.label}`}
              aria-current={isActive ? "step" : undefined}
            >
              <div
                className={`flex size-7 items-center justify-center rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : isDone
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                }`}
                aria-hidden="true"
              >
                {isDone ? "✓" : index + 1}
              </div>
              <span
                className={`max-w-[72px] truncate text-xs ${
                  isActive ? "font-medium text-primary" : "text-muted-foreground"
                }`}
                aria-hidden="true"
              >
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={`mx-1 h-0.5 w-4 shrink-0 rounded ${
                  index < currentStep ? "bg-primary/60" : "bg-border"
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
