import { describe, expect, it } from "vitest";

import {
  getAllVisualizations,
  getNetworkVisualizations,
  getVisualizationBySlug,
  groupVisualizationsByCategory,
} from "@/lib/visualization/get-visualizations";

describe("get-visualizations", () => {
  it("lists all visualizations", () => {
    expect(getAllVisualizations().length).toBeGreaterThanOrEqual(28);
  });

  it("groups by category with network first", () => {
    const groups = groupVisualizationsByCategory();
    expect(groups[0]?.category).toBe("network");
    expect(groups.some((group) => group.category === "security")).toBe(true);
    expect(groups.some((group) => group.category === "database")).toBe(true);
  });

  it("returns network visualizations only", () => {
    const network = getNetworkVisualizations();
    expect(network.every((viz) => viz.category === "network")).toBe(true);
  });

  it("finds jwt-flow and sql-query-flow", () => {
    expect(getVisualizationBySlug("jwt-flow")?.conceptSlug).toBe("jwt");
    expect(getVisualizationBySlug("sql-query-flow")?.conceptSlug).toBe("sql");
  });
});
