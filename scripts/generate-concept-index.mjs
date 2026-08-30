import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const dataDir = path.join(rootDir, "data");

function toCamelCase(slug) {
  return slug.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listJsonFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));
}

function generateConceptIndex() {
  const conceptsDir = path.join(dataDir, "concepts");
  const files = listJsonFiles(conceptsDir);

  const entries = files.map((file) => {
    const slug = file.replace(/\.json$/, "");
    const concept = loadJson(path.join(conceptsDir, file));
    if (concept.slug !== slug) {
      console.warn(`Warning: ${file} slug "${concept.slug}" != filename "${slug}"`);
    }
    return { slug, varName: toCamelCase(slug), file };
  });

  entries.sort((a, b) => a.slug.localeCompare(b.slug));

  const imports = entries
    .map((entry) => `import ${entry.varName} from "./${entry.slug}.json";`)
    .join("\n");

  const arrayItems = entries.map((entry) => `  ${entry.varName},`).join("\n");

  const content = `${imports}
import type { Concept } from "@/types/concept";

export const concepts: Concept[] = [
${arrayItems}
] as Concept[];
`;

  fs.writeFileSync(path.join(conceptsDir, "index.ts"), content, "utf8");
  console.log(`Generated concepts/index.ts (${entries.length} concepts)`);
}

function generateScenarioRegistry() {
  const scenariosDir = path.join(dataDir, "scenarios");
  const files = listJsonFiles(scenariosDir);

  const entries = files.map((file) => {
    const slug = file.replace(/\.json$/, "");
    return { slug, varName: toCamelCase(slug) };
  });

  const imports = entries
    .map(
      (entry) =>
        `import ${entry.varName} from "@/data/scenarios/${entry.slug}.json";`,
    )
    .join("\n");

  const arrayItems = entries.map((entry) => `  ${entry.varName},`).join("\n");

  const content = `${imports}
import type { Scenario } from "@/types/scenario";

const scenarios: Scenario[] = [
${arrayItems}
] as Scenario[];

export function getAllScenarios(): Scenario[] {
  return scenarios;
}

export function getScenarioBySlug(slug: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.slug === slug);
}

export function getScenarioSlugs(): string[] {
  return scenarios.map((scenario) => scenario.slug);
}
`;

  fs.writeFileSync(
    path.join(rootDir, "lib", "content", "get-scenarios.ts"),
    content,
    "utf8",
  );
  console.log(`Generated get-scenarios.ts (${entries.length} scenarios)`);
}

function generateVisualizationRegistry() {
  const vizDir = path.join(dataDir, "visualizations");
  const files = listJsonFiles(vizDir);

  const entries = files.map((file) => {
    const slug = file.replace(/\.json$/, "");
    return { slug, varName: toCamelCase(slug) };
  });

  const imports = entries
    .map(
      (entry) =>
        `import ${entry.varName} from "@/data/visualizations/${entry.slug}.json";`,
    )
    .join("\n");

  const arrayItems = entries.map((entry) => `  ${entry.varName},`).join("\n");

  const content = `${imports}
import type { Visualization } from "@/types/visualization";

const visualizations: Visualization[] = [
${arrayItems}
] as Visualization[];

export function getAllVisualizations(): Visualization[] {
  return visualizations;
}

export function getVisualizationBySlug(slug: string): Visualization | undefined {
  return visualizations.find((viz) => viz.slug === slug);
}

export function getVisualizationSlugs(): string[] {
  return visualizations.map((viz) => viz.slug);
}

export function getNetworkVisualizations(): Visualization[] {
  return visualizations.filter((viz) => viz.category === "network");
}

export function getProgrammingVisualizations(): Visualization[] {
  return visualizations.filter((viz) => viz.category === "programming");
}

export function getVisualizationsByCategory(category: string): Visualization[] {
  return visualizations.filter((viz) => viz.category === category);
}

export function groupVisualizationsByCategory(): Array<{
  category: string;
  visualizations: Visualization[];
}> {
  const order = ["network", "programming", "security", "database", "devops", "iot", "cloud"];
  const grouped = new Map<string, Visualization[]>();

  for (const viz of visualizations) {
    const key = viz.category ?? "other";
    const list = grouped.get(key) ?? [];
    list.push(viz);
    grouped.set(key, list);
  }

  const known = order
    .filter((category) => grouped.has(category))
    .map((category) => ({
      category,
      visualizations: grouped.get(category)!,
    }));

  const extras = [...grouped.entries()]
    .filter(([category]) => !order.includes(category))
    .map(([category, items]) => ({ category, visualizations: items }));

  return [...known, ...extras];
}

export function getVisualizationByConcept(conceptSlug: string): Visualization | undefined {
  return visualizations.find((viz) => viz.conceptSlug === conceptSlug);
}
`;

  fs.writeFileSync(
    path.join(rootDir, "lib", "visualization", "get-visualizations.ts"),
    content,
    "utf8",
  );
  console.log(`Generated get-visualizations.ts (${entries.length} visualizations)`);
}

generateConceptIndex();
generateScenarioRegistry();
generateVisualizationRegistry();
console.log("Done.");
