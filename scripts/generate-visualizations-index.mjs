import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vizDir = path.join(__dirname, "..", "data", "visualizations");

const OVERRIDES = {
  "open-website": "openWebsite",
  login: "login",
  "client-server": "clientServer",
  "frontend-backend": "frontendBackend",
  "load-balancer": "loadBalancer",
  "git-workflow": "gitWorkflow",
  "sql-query": "sqlQuery",
  "iot-gateway": "iotGateway",
  "cloud-vm": "cloudVm",
  "object-storage": "objectStorage",
  "git-commit": "gitCommit",
  "git-merge": "gitMerge",
  "git-branch": "gitBranch",
  "git-push": "gitPush",
  "cli-navigation": "cliNavigation",
  "curl-request": "curlRequest",
  "ping-test": "pingTest",
  "boot-process": "bootProcess",
  "cpu-memory": "cpuMemory",
  "linked-list": "linkedList",
  "hash-table": "hashTable",
  "file-read": "fileRead",
  "file-ops": "fileOps",
  "file-search": "fileSearch",
  "ip-config": "ipConfig",
  "network-connect": "networkConnect",
  "git-diff": "gitDiff",
  "git-log": "gitLog",
  "git-stash": "gitStash",
  "edge-computing": "edgeComputing",
  "network-hardware": "networkHardware",
  "embedded-board": "embeddedBoard",
  "server-infra": "serverInfra",
  "security-hardware": "securityHardware",
  "specialized-chip": "specializedChip",
};

function toVarName(slug) {
  const base = slug.replace(/-flow$/, "");
  if (OVERRIDES[base]) return `${OVERRIDES[base]}Flow`;
  const camel = base.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  return `${camel}Flow`;
}

const files = fs
  .readdirSync(vizDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

const varNames = files.map((f) => toVarName(f.replace(".json", "")));

const importLines = files.map((f, i) => {
  return `import ${varNames[i]} from "@/data/visualizations/${f}";`;
});

const content = `${importLines.join("\n")}
import type { Visualization } from "@/types/visualization";

const visualizations: Visualization[] = [
  ${varNames.join(",\n  ")},
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
  const order = [
    "network",
    "programming",
    "security",
    "database",
    "devops",
    "cloud",
    "ai",
    "iot",
    "cli",
    "git-github",
    "hardware",
  ];
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
  path.join(__dirname, "..", "lib", "visualization", "get-visualizations.ts"),
  content,
);
console.log(`Wrote get-visualizations.ts with ${files.length} visualizations`);
