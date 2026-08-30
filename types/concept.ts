export type Difficulty = "beginner" | "intermediate" | "advanced";

export type SectionType =
  | "overview"
  | "what_is"
  | "why"
  | "how_it_works"
  | "key_components"
  | "real_world_example"
  | "common_confusion"
  | "analogy";

export interface ConceptSection {
  type: SectionType;
  title?: string;
  content: string;
  items?: string[];
}

export interface Concept {
  slug: string;
  title: string;
  fullName?: string;
  summary: string;
  difficulty: Difficulty;
  category: string;
  subcategory?: string;
  platform?: string;
  tags: string[];
  icon?: string;
  sections: ConceptSection[];
  related: string[];
  prerequisites?: string[];
  visualization?: string;
  simulation?: string;
}

export interface CliSubcategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  platform: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  startHere?: string[];
}

export type RelationType =
  | "uses"
  | "returns"
  | "requires"
  | "part_of"
  | "related"
  | "builds_on";

export interface ConceptRelation {
  source: string;
  target: string;
  type: RelationType;
  label?: string;
}
