import type { Difficulty } from "./concept";

export interface LearningPathStep {
  order: number;
  conceptSlug: string;
  title?: string;
  note?: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  icon: string;
  estimatedMinutes: number;
  category?: string;
  steps: LearningPathStep[];
  scenarioSlug?: string;
}
