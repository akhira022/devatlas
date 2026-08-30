"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

export interface ConceptNodeData {
  label: string;
  category: string;
  dimmed?: boolean;
  selected?: boolean;
}

function ConceptNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as ConceptNodeData;

  return (
    <div
      className={cn(
        "min-w-[120px] rounded-lg border bg-card px-4 py-2.5 text-center shadow-sm transition-all",
        nodeData.selected && "border-primary ring-2 ring-primary/30",
        nodeData.dimmed && "opacity-30",
        !nodeData.selected && !nodeData.dimmed && "border-border/60 hover:border-primary/40",
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <p className="text-sm font-medium">{nodeData.label}</p>
      <p className="text-xs capitalize text-muted-foreground">{nodeData.category}</p>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}

export const ConceptNode = memo(ConceptNodeComponent);
