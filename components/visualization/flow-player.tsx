"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Hand } from "lucide-react";

import { ExplanationPanel } from "@/components/visualization/explanation-panel";
import { FlowControls } from "@/components/visualization/flow-controls";
import { FlowNode, type FlowNodeData } from "@/components/visualization/flow-node";
import { StepTimeline } from "@/components/visualization/step-timeline";
import { useTheme } from "@/components/theme/theme-provider";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Visualization } from "@/types/visualization";

const nodeTypes = { flow: FlowNode };

interface FlowPlayerProps {
  visualization: Visualization;
  externalStep?: number;
  onStepChange?: (step: number) => void;
}

export function FlowPlayer({
  visualization,
  externalStep,
  onStepChange,
}: FlowPlayerProps) {
  const [internalStep, setInternalStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const currentStep = externalStep ?? internalStep;

  const updateStep = (value: number) => {
    const clamped = Math.max(0, Math.min(visualization.steps.length - 1, value));
    if (externalStep === undefined) {
      setInternalStep(clamped);
    }
    onStepChange?.(clamped);
  };

  const step = visualization.steps[currentStep] ?? null;

  const visitedNodes = useMemo(() => {
    const visited = new Set<string>();
    for (let i = 0; i <= currentStep; i++) {
      const s = visualization.steps[i];
      if (s) {
        visited.add(s.from);
        visited.add(s.to);
      }
    }
    return visited;
  }, [currentStep, visualization.steps]);

  const activeNodes = useMemo(() => {
    const current = visualization.steps[currentStep];
    if (!current) return new Set<string>();
    return new Set([current.from, current.to]);
  }, [currentStep, visualization.steps]);

  const activeStepId = visualization.steps[currentStep]?.id ?? null;

  useEffect(() => {
    if (!isPlaying) return;

    const duration = prefersReducedMotion
      ? 0
      : (visualization.steps[currentStep]?.duration ?? 1500);
    const timer = setTimeout(() => {
      if (currentStep < visualization.steps.length - 1) {
        updateStep(currentStep + 1);
      } else {
        setIsPlaying(false);
      }
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentStep, visualization.steps, prefersReducedMotion]);

  const nodes: Node[] = useMemo(
    () =>
      visualization.nodes.map((node) => ({
        id: node.id,
        type: "flow",
        position: node.position,
        data: {
          label: node.label,
          description: node.description,
          type: node.type,
          active: activeNodes.has(node.id),
          visited: visitedNodes.has(node.id),
        } satisfies FlowNodeData,
      })),
    [visualization.nodes, activeNodes, visitedNodes],
  );

  const edges: Edge[] = useMemo(
    () =>
      visualization.steps.map((flowStep, index) => {
        const isActive = activeStepId === flowStep.id;
        const isDone = index < currentStep;

        return {
          id: flowStep.id,
          source: flowStep.from,
          target: flowStep.to,
          label: isActive ? flowStep.label : isDone ? flowStep.label : undefined,
          animated: isActive && !prefersReducedMotion,
          style: {
            stroke: isActive
              ? "var(--primary)"
              : isDone
                ? "color-mix(in oklch, var(--primary) 50%, var(--border))"
                : "var(--border)",
            strokeWidth: isActive ? 2.5 : isDone ? 1.5 : 1,
            opacity: index <= currentStep ? 1 : 0.25,
          },
          labelStyle: {
            fontSize: 12,
            fill: isActive ? "var(--primary)" : "var(--muted-foreground)",
            fontWeight: isActive ? 700 : 500,
          },
          labelBgStyle: {
            fill: "var(--card)",
            fillOpacity: 0.9,
          },
        };
      }),
    [visualization.steps, activeStepId, currentStep, prefersReducedMotion],
  );

  const handleReset = () => {
    setIsPlaying(false);
    updateStep(0);
  };

  return (
    <div className="space-y-4">
      {visualization.protocol && (
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {visualization.protocol}
          </span>
          <span className="text-sm text-muted-foreground">
            {visualization.nodes.length} nodes · {visualization.steps.length} steps
          </span>
        </div>
      )}

      <div className="surface-subtle relative h-[min(55vh,420px)] min-h-[280px] overflow-hidden sm:h-[360px]">
        <p className="pointer-events-none absolute top-2 left-2 z-10 flex items-center gap-1.5 rounded-md border border-border/60 bg-card/90 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur-sm">
          <Hand className="size-3" aria-hidden="true" />
          ลาก / pinch เพื่อเลื่อน-ซูมพรีวิว
        </p>
        <ReactFlow
          colorMode={theme}
          className={cn("h-full w-full")}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch
          zoomOnDoubleClick
          minZoom={0.35}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={24} size={1} color="var(--border)" />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </div>

      <StepTimeline
        steps={visualization.steps}
        currentStep={currentStep}
        onStepClick={(index) => {
          setIsPlaying(false);
          updateStep(index);
        }}
      />

      <FlowControls
        isPlaying={isPlaying}
        currentStep={currentStep}
        totalSteps={visualization.steps.length}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={handleReset}
        onPrev={() => {
          setIsPlaying(false);
          updateStep(currentStep - 1);
        }}
        onNext={() => {
          setIsPlaying(false);
          updateStep(currentStep + 1);
        }}
      />

      <ExplanationPanel step={step} />
    </div>
  );
}
