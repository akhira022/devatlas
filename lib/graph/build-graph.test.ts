import { describe, expect, it } from "vitest";

import { buildGraphData, getConnectedNodeIds } from "@/lib/graph/build-graph";

describe("build-graph", () => {
  it("builds full graph with nodes and edges", () => {
    const graph = buildGraphData();
    expect(graph.nodes.length).toBeGreaterThan(100);
    expect(graph.edges.length).toBeGreaterThan(50);
  });

  it("filters by category and only keeps in-category edges", () => {
    const graph = buildGraphData({ categorySlug: "network" });
    expect(graph.nodes.length).toBeGreaterThan(10);
    expect(graph.nodes.every((node) => node.category === "network")).toBe(true);

    const ids = new Set(graph.nodes.map((node) => node.id));
    for (const edge of graph.edges) {
      expect(ids.has(edge.source)).toBe(true);
      expect(ids.has(edge.target)).toBe(true);
    }
  });

  it("uses 2D grid positions when filtered", () => {
    const graph = buildGraphData({ categorySlug: "cli" });
    const xs = new Set(graph.nodes.map((node) => node.position.x));
    expect(xs.size).toBeGreaterThan(1);
  });

  it("returns connected node ids for a focus node", () => {
    const graph = buildGraphData();
    const connected = getConnectedNodeIds(graph, "http");
    expect(connected.has("http")).toBe(true);
    expect(connected.size).toBeGreaterThan(1);
  });
});
