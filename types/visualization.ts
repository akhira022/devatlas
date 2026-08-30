export type FlowNodeType =
  | "client"
  | "server"
  | "database"
  | "network"
  | "service"
  | "device";

export interface FlowNode {
  id: string;
  label: string;
  description: string;
  type: FlowNodeType;
  position: { x: number; y: number };
}

export interface FlowStep {
  id: string;
  from: string;
  to: string;
  label: string;
  description: string;
  duration?: number;
  packet?: string;
}

export interface Visualization {
  slug: string;
  title: string;
  description: string;
  conceptSlug: string;
  protocol?: string;
  category?: string;
  nodes: FlowNode[];
  steps: FlowStep[];
}
