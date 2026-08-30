"use client";

import { memo } from "react";
import {
  Cloud,
  Database,
  Globe,
  Radio,
  Server,
  Shield,
} from "lucide-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

import { cn } from "@/lib/utils";
import type { FlowNodeType } from "@/types/visualization";

export interface FlowNodeData {
  label: string;
  description?: string;
  type: FlowNodeType;
  active?: boolean;
  visited?: boolean;
}

const nodeConfig: Record<
  FlowNodeType,
  { icon: typeof Globe; color: string; bg: string }
> = {
  client: { icon: Globe, color: "#3B82F6", bg: "#3B82F620" },
  server: { icon: Server, color: "#8B5CF6", bg: "#8B5CF620" },
  database: { icon: Database, color: "#10B981", bg: "#10B98120" },
  network: { icon: Cloud, color: "#06B6D4", bg: "#06B6D420" },
  service: { icon: Shield, color: "#F59E0B", bg: "#F59E0B20" },
  device: { icon: Radio, color: "#EC4899", bg: "#EC489920" },
};

function FlowNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as FlowNodeData;
  const config = nodeConfig[nodeData.type] ?? nodeConfig.client;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "min-w-[130px] rounded-xl border-2 bg-card px-4 py-3 shadow-sm transition-all duration-300",
        nodeData.active && "scale-105 border-primary shadow-lg shadow-primary/20",
        nodeData.visited && !nodeData.active && "border-primary/40",
        !nodeData.active && !nodeData.visited && "border-border/60",
      )}
    >
      <Handle type="target" position={Position.Left} className="!border-primary !bg-primary" />
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="flex size-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: config.bg }}
        >
          <Icon className="size-4" style={{ color: config.color }} />
        </div>
        <p className="text-sm font-semibold">{nodeData.label}</p>
      </div>
      <Handle type="source" position={Position.Right} className="!border-primary !bg-primary" />
    </div>
  );
}

export const FlowNode = memo(FlowNodeComponent);
