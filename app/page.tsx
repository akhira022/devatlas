import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedVisualization } from "@/components/home/featured-visualization";
import { Hero } from "@/components/home/hero";
import { LearningPathPreview } from "@/components/home/learning-path-preview";
import { PopularConcepts } from "@/components/home/popular-concepts";
import { ScenarioPreview } from "@/components/home/scenario-preview";
import { VisualCheatsheets } from "@/components/home/visual-cheatsheets";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <LearningPathPreview />
      <VisualCheatsheets />
      <PopularConcepts />
      <ScenarioPreview />
      <FeaturedVisualization />
    </>
  );
}
