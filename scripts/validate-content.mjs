import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const rootDir = path.join(__dirname, "..");

const REQUIRED_SECTIONS = [
  "what_is",
  "why",
  "how_it_works",
  "common_confusion",
];

const OPTIONAL_RICH_SECTIONS = ["key_components", "real_world_example"];

const COMMAND_CATEGORIES = new Set(["cli", "git-github"]);
const COMMAND_REQUIRED_SECTIONS = ["how_it_works", "common_confusion"];

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sectionIsValid(section) {
  const hasContent = section.content && section.content.trim().length >= 20;
  const hasItems = section.items && section.items.length >= 2;
  return hasContent || hasItems;
}

function validateConcepts(conceptSlugs, categorySlugs, vizSlugs) {
  const issues = [];
  const conceptsDir = path.join(dataDir, "concepts");
  const seenSlugs = new Map();

  for (const file of fs.readdirSync(conceptsDir).filter((f) => f.endsWith(".json"))) {
    const concept = loadJson(path.join(conceptsDir, file));
    const expectedSlug = file.replace(/\.json$/, "");

    if (!concept.slug) issues.push(`${file}: missing slug`);
    if (concept.slug && concept.slug !== expectedSlug) {
      issues.push(`${file}: slug "${concept.slug}" should match filename "${expectedSlug}"`);
    }
    if (concept.slug) {
      if (seenSlugs.has(concept.slug)) {
        issues.push(`${concept.slug}: duplicate slug (also in ${seenSlugs.get(concept.slug)})`);
      } else {
        seenSlugs.set(concept.slug, file);
      }
    }
    if (!concept.title) issues.push(`${concept.slug}: missing title`);
    if (!concept.summary || concept.summary.length < 15) {
      issues.push(`${concept.slug}: summary too short`);
    }
    if (!categorySlugs.has(concept.category)) {
      issues.push(`${concept.slug}: invalid category "${concept.category}"`);
    }
    if (!concept.related?.length) issues.push(`${concept.slug}: no related concepts`);

    const byType = Object.fromEntries(
      (concept.sections ?? []).map((s) => [s.type, s]),
    );
    const required = COMMAND_CATEGORIES.has(concept.category)
      ? COMMAND_REQUIRED_SECTIONS
      : REQUIRED_SECTIONS;

    for (const type of required) {
      if (!byType[type]) issues.push(`${concept.slug}: missing section "${type}"`);
      else if (!sectionIsValid(byType[type])) {
        issues.push(`${concept.slug}: thin section "${type}"`);
      }
    }

    if (!COMMAND_CATEGORIES.has(concept.category)) {
      for (const type of OPTIONAL_RICH_SECTIONS) {
        if (byType[type] && !sectionIsValid(byType[type])) {
          issues.push(`${concept.slug}: thin section "${type}"`);
        }
      }
    }

    for (const related of concept.related ?? []) {
      if (!conceptSlugs.has(related)) {
        issues.push(`${concept.slug}: broken related "${related}"`);
      }
    }
    if (concept.visualization && !vizSlugs.has(concept.visualization)) {
      issues.push(`${concept.slug}: broken visualization "${concept.visualization}"`);
    }
    for (const prereq of concept.prerequisites ?? []) {
      if (!conceptSlugs.has(prereq)) {
        issues.push(`${concept.slug}: broken prerequisite "${prereq}"`);
      }
    }
    if (JSON.stringify(concept).includes("อนุญาิ")) {
      issues.push(`${concept.slug}: contains typo อนุญาิ`);
    }
  }

  return issues;
}

function validateConceptIndex(conceptSlugs) {
  const issues = [];
  const indexPath = path.join(dataDir, "concepts", "index.ts");
  if (!fs.existsSync(indexPath)) {
    issues.push("concepts/index.ts: missing — run npm run generate:index");
    return issues;
  }

  const indexSource = fs.readFileSync(indexPath, "utf8");
  const imported = new Set(
    [...indexSource.matchAll(/from "\.\/([^"]+)\.json"/g)].map((match) => match[1]),
  );

  for (const slug of conceptSlugs) {
    if (!imported.has(slug)) {
      issues.push(`concepts/index.ts: missing import for "${slug}" — run npm run generate:index`);
    }
  }

  for (const slug of imported) {
    if (!conceptSlugs.has(slug)) {
      issues.push(`concepts/index.ts: orphan import "${slug}" (no JSON file)`);
    }
  }

  return issues;
}

function validateVisualizations(conceptSlugs) {
  const issues = [];
  const vizDir = path.join(dataDir, "visualizations");
  const seenSlugs = new Map();

  for (const file of fs.readdirSync(vizDir).filter((f) => f.endsWith(".json"))) {
    const viz = loadJson(path.join(vizDir, file));
    const nodeIds = new Set(viz.nodes.map((n) => n.id));

    if (viz.slug && seenSlugs.has(viz.slug)) {
      issues.push(`${viz.slug}: duplicate visualization slug (also in ${seenSlugs.get(viz.slug)})`);
    } else if (viz.slug) {
      seenSlugs.set(viz.slug, file);
    }

    if (!viz.description || viz.description.length < 10) {
      issues.push(`${viz.slug}: description too short`);
    }
    if (!conceptSlugs.has(viz.conceptSlug)) {
      issues.push(`${viz.slug}: broken conceptSlug "${viz.conceptSlug}"`);
    }
    for (const step of viz.steps) {
      if (!nodeIds.has(step.from)) issues.push(`${viz.slug}: step ${step.id} bad from`);
      if (!nodeIds.has(step.to)) issues.push(`${viz.slug}: step ${step.id} bad to`);
      if (!step.description?.trim()) issues.push(`${viz.slug}: step ${step.id} empty description`);
    }
    if (JSON.stringify(viz).includes("อนุญาิ")) {
      issues.push(`${viz.slug}: contains typo อนุญาิ`);
    }
  }

  return issues;
}

function validateScenarios(conceptSlugs, vizSlugs) {
  const issues = [];
  const scenariosDir = path.join(dataDir, "scenarios");

  for (const file of fs.readdirSync(scenariosDir).filter((f) => f.endsWith(".json"))) {
    const scenario = loadJson(path.join(scenariosDir, file));

    if (!vizSlugs.has(scenario.visualization)) {
      issues.push(`${scenario.slug}: broken visualization`);
    }
    if (!scenario.steps?.length) issues.push(`${scenario.slug}: no steps`);
    for (const concept of scenario.concepts ?? []) {
      if (!conceptSlugs.has(concept)) {
        issues.push(`${scenario.slug}: broken concept "${concept}"`);
      }
    }
    for (const step of scenario.steps ?? []) {
      if (step.conceptSlug && !conceptSlugs.has(step.conceptSlug)) {
        issues.push(`${scenario.slug}: step ${step.order} bad conceptSlug`);
      }
    }
  }

  return issues;
}

function validateRelations(conceptSlugs) {
  const issues = [];
  const relations = loadJson(path.join(dataDir, "relations.json"));

  for (const rel of relations) {
    if (!conceptSlugs.has(rel.source)) issues.push(`relation: bad source "${rel.source}"`);
    if (!conceptSlugs.has(rel.target)) issues.push(`relation: bad target "${rel.target}"`);
  }

  return issues;
}

function validateVizRegistry(vizSlugs) {
  const issues = [];
  const registryPath = path.join(rootDir, "lib", "visualization", "get-visualizations.ts");
  if (!fs.existsSync(registryPath)) {
    issues.push("get-visualizations.ts: missing");
    return issues;
  }

  const source = fs.readFileSync(registryPath, "utf8");
  const imported = new Set(
    [...source.matchAll(/from "@\/data\/visualizations\/([^"]+)\.json"/g)].map(
      (match) => match[1],
    ),
  );

  for (const slug of vizSlugs) {
    if (!imported.has(slug)) {
      issues.push(`get-visualizations.ts: missing "${slug}" — run npm run generate:index`);
    }
  }

  return issues;
}

const conceptsDir = path.join(dataDir, "concepts");
const conceptSlugs = new Set(
  fs
    .readdirSync(conceptsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => loadJson(path.join(conceptsDir, f)).slug),
);
const categorySlugs = new Set(loadJson(path.join(dataDir, "categories.json")).map((c) => c.slug));
const vizSlugs = new Set(
  fs
    .readdirSync(path.join(dataDir, "visualizations"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => loadJson(path.join(path.join(dataDir, "visualizations"), f)).slug),
);

function validateQuizzes(conceptSlugs) {
  const issues = [];
  const quizPath = path.join(dataDir, "quizzes.json");
  if (!fs.existsSync(quizPath)) return issues;

  const quizzes = loadJson(quizPath);
  for (const [slug, quiz] of Object.entries(quizzes)) {
    if (!conceptSlugs.has(slug)) {
      issues.push(`quiz: broken conceptSlug "${slug}"`);
    }
    for (const q of quiz.questions ?? []) {
      if (q.correctIndex < 0 || q.correctIndex >= (q.options?.length ?? 0)) {
        issues.push(`quiz ${slug}: invalid correctIndex`);
      }
      if (!q.question?.trim()) issues.push(`quiz ${slug}: empty question`);
    }
  }
  return issues;
}

function validateDecisionTrees(conceptSlugs, compareSlugs) {
  const issues = [];
  const treesDir = path.join(dataDir, "decision-trees");
  if (!fs.existsSync(treesDir)) return issues;

  for (const file of fs.readdirSync(treesDir).filter((f) => f.endsWith(".json"))) {
    const tree = loadJson(path.join(treesDir, file));
    const nodeIds = new Set(tree.nodes.map((n) => n.id));
    const resultIds = new Set(tree.results.map((r) => r.id));

    if (!nodeIds.has(tree.startNodeId)) {
      issues.push(`${tree.slug}: invalid startNodeId`);
    }
    for (const node of tree.nodes) {
      for (const opt of node.options ?? []) {
        const next = opt.next;
        if (next.startsWith("result:")) {
          if (!resultIds.has(next.slice("result:".length))) {
            issues.push(`${tree.slug}: bad result ref ${next}`);
          }
        } else if (!nodeIds.has(next)) {
          issues.push(`${tree.slug}: bad node ref ${next}`);
        }
      }
    }
    for (const result of tree.results) {
      for (const cs of result.conceptSlugs ?? []) {
        if (!conceptSlugs.has(cs)) issues.push(`${tree.slug}: bad concept ${cs}`);
      }
      if (result.compareSlug && !compareSlugs.has(result.compareSlug)) {
        issues.push(`${tree.slug}: bad compareSlug ${result.compareSlug}`);
      }
    }
  }
  return issues;
}

const compareSlugs = new Set(
  fs.existsSync(path.join(dataDir, "comparisons"))
    ? fs
        .readdirSync(path.join(dataDir, "comparisons"))
        .filter((f) => f.endsWith(".json"))
        .map((f) => loadJson(path.join(dataDir, "comparisons", f)).slug)
    : [],
);

const allIssues = [
  ...validateConcepts(conceptSlugs, categorySlugs, vizSlugs),
  ...validateConceptIndex(conceptSlugs),
  ...validateVisualizations(conceptSlugs),
  ...validateVizRegistry(vizSlugs),
  ...validateScenarios(conceptSlugs, vizSlugs),
  ...validateRelations(conceptSlugs),
  ...validateQuizzes(conceptSlugs),
  ...validateDecisionTrees(conceptSlugs, compareSlugs),
];

if (allIssues.length > 0) {
  console.error(`Content validation failed (${allIssues.length} issues):\n`);
  for (const issue of allIssues) console.error(`  - ${issue}`);
  process.exit(1);
}

console.log("Content validation passed");
console.log(`  Concepts: ${conceptSlugs.size}`);
console.log(`  Visualizations: ${vizSlugs.size}`);
console.log(
  `  Scenarios: ${fs.readdirSync(path.join(dataDir, "scenarios")).filter((f) => f.endsWith(".json")).length}`,
);
const quizCount = fs.existsSync(path.join(dataDir, "quizzes.json"))
  ? Object.keys(loadJson(path.join(dataDir, "quizzes.json"))).length
  : 0;
const treeCount = fs.existsSync(path.join(dataDir, "decision-trees"))
  ? fs.readdirSync(path.join(dataDir, "decision-trees")).filter((f) => f.endsWith(".json")).length
  : 0;
console.log(`  Quizzes: ${quizCount} concepts`);
console.log(`  Decision trees: ${treeCount}`);
