export interface ComparisonRow {
  label: string;
  values: string[];
}

export interface ComparisonItem {
  conceptSlug: string;
  name: string;
  tagline: string;
}

export interface Comparison {
  slug: string;
  title: string;
  description: string;
  icon: string;
  items: ComparisonItem[];
  rows: ComparisonRow[];
  whenToUse: { label: string; pick: string }[];
}
