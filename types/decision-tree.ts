export interface DecisionOption {
  label: string;
  description?: string;
  /** Node id or result id prefixed with `result:` */
  next: string;
}

export interface DecisionNode {
  id: string;
  question: string;
  help?: string;
  options: DecisionOption[];
}

export interface DecisionResult {
  id: string;
  title: string;
  summary: string;
  conceptSlugs: string[];
  compareSlug?: string;
  learnPathSlug?: string;
}

export interface DecisionTree {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category?: string;
  startNodeId: string;
  nodes: DecisionNode[];
  results: DecisionResult[];
}
