import type { ConceptRelation } from "./concept";

export interface GraphNode {
  id: string;
  label: string;
  category: string;
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: ConceptRelation["type"];
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
