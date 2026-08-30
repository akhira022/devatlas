import authenticationVsAuthorization from "@/data/comparisons/authentication-vs-authorization.json";
import cloudVsEdge from "@/data/comparisons/cloud-vs-edge.json";
import gitMergeVsRebase from "@/data/comparisons/git-merge-vs-rebase.json";
import restVsGraphql from "@/data/comparisons/rest-vs-graphql.json";
import sqlVsNosql from "@/data/comparisons/sql-vs-nosql.json";
import tcpVsUdp from "@/data/comparisons/tcp-vs-udp.json";
import unixVsWindowsCli from "@/data/comparisons/unix-vs-windows-cli.json";
import type { Comparison } from "@/types/comparison";

const comparisons: Comparison[] = [
  tcpVsUdp,
  restVsGraphql,
  authenticationVsAuthorization,
  gitMergeVsRebase,
  sqlVsNosql,
  unixVsWindowsCli,
  cloudVsEdge,
] as Comparison[];

export function getAllComparisons(): Comparison[] {
  return [...comparisons];
}

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getComparisonSlugs(): string[] {
  return comparisons.map((c) => c.slug);
}

export function getComparisonsForConcept(conceptSlug: string): Comparison[] {
  return comparisons.filter((c) =>
    c.items.some((item) => item.conceptSlug === conceptSlug),
  );
}
