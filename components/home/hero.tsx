import { CommandSearch } from "@/components/search/command-search";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getAllCategories, getAllConcepts } from "@/lib/content/get-concepts";
import { getAllScenarios } from "@/lib/content/get-scenarios";
import { getAllVisualizations } from "@/lib/visualization/get-visualizations";

export function Hero() {
  const conceptCount = getAllConcepts().length;
  const vizCount = getAllVisualizations().length;
  const categoryCount = getAllCategories().length;
  const scenarioCount = getAllScenarios().length;

  return (
    <section className="container flex flex-col items-center px-4 py-16 text-center md:py-24">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
        DA
      </div>
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{SITE_NAME}</h1>
      <p className="prose-lead mt-3 max-w-xl">{SITE_DESCRIPTION}</p>
      <p className="mt-4 text-sm text-muted-foreground">
        {conceptCount} concepts · {vizCount} animations · {categoryCount} categories ·{" "}
        {scenarioCount} scenarios
      </p>
      <div className="mt-8 w-full max-w-md">
        <CommandSearch />
      </div>
    </section>
  );
}
