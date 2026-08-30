import type { FlowStep } from "@/types/visualization";

interface ExplanationPanelProps {
  step: FlowStep | null;
}

export function ExplanationPanel({ step }: ExplanationPanelProps) {
  if (!step) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="surface-muted p-4 text-sm prose-content-muted"
      >
        กด ▶ Play เพื่อดูการเดินทางของ protocol ทีละขั้นตอน
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="rounded-lg border border-primary/30 bg-primary/5 p-4"
    >
      <div className="flex items-center gap-2">
        <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
          {step.packet ?? step.label}
        </span>
        <span className="text-xs text-muted-foreground">
          {step.from} → {step.to}
        </span>
      </div>
      <p className="prose-content mt-2 text-sm">{step.description}</p>
    </div>
  );
}
