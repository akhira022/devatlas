import { StartHereBanner } from "@/components/category/start-here-banner";
import type { Category } from "@/types/concept";

interface CategoryStartHereProps {
  category: Category;
}

export function CategoryStartHere({ category }: CategoryStartHereProps) {
  if (!category.startHere?.length) return null;

  return <StartHereBanner slugs={category.startHere} categoryName={category.name} />;
}
