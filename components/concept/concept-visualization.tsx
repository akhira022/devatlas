"use client";

import { FlowPlayer } from "@/components/visualization/flow-player";
import type { Visualization } from "@/types/visualization";

interface ConceptVisualizationProps {
  visualization: Visualization;
}

export function ConceptVisualization({ visualization }: ConceptVisualizationProps) {
  return (
    <section className="surface-muted p-6">
      <h2 className="mb-1 text-lg font-semibold">🎬 Protocol Animation</h2>
      <p className="mb-4 text-sm text-muted-foreground">{visualization.description}</p>
      <FlowPlayer visualization={visualization} />
    </section>
  );
}
