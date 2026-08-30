import chooseApi from "@/data/decision-trees/choose-api.json";
import chooseDatabase from "@/data/decision-trees/choose-database.json";
import chooseDeploy from "@/data/decision-trees/choose-deploy.json";
import chooseGitFlow from "@/data/decision-trees/choose-git-flow.json";
import chooseHosting from "@/data/decision-trees/choose-hosting.json";
import chooseTransport from "@/data/decision-trees/choose-transport.json";
import type { DecisionTree } from "@/types/decision-tree";

const decisionTrees: DecisionTree[] = [
  chooseDatabase,
  chooseApi,
  chooseTransport,
  chooseGitFlow,
  chooseHosting,
  chooseDeploy,
] as DecisionTree[];

export function getAllDecisionTrees(): DecisionTree[] {
  return [...decisionTrees];
}

export function getDecisionTreeBySlug(slug: string): DecisionTree | undefined {
  return decisionTrees.find((tree) => tree.slug === slug);
}

export function getDecisionTreeSlugs(): string[] {
  return decisionTrees.map((tree) => tree.slug);
}
