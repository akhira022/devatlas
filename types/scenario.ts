import type { Difficulty } from "./concept";

export interface ScenarioStep {
  order: number;
  title: string;
  description: string;
  conceptSlug?: string;
  highlightNodes?: string[];
}

export interface Scenario {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  icon: string;
  concepts: string[];
  visualization: string;
  steps: ScenarioStep[];
}
