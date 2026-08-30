import { describe, expect, it } from "vitest";

import {
  getAllConcepts,
  getConceptBySlug,
  getConceptsByCategory,
  getRelatedConcepts,
  groupGitConceptsBySubcategory,
} from "@/lib/content/get-concepts";

describe("get-concepts", () => {
  it("returns concepts sorted by title", () => {
    const concepts = getAllConcepts();
    expect(concepts.length).toBeGreaterThan(100);
    for (let i = 1; i < concepts.length; i++) {
      expect(concepts[i - 1].title.localeCompare(concepts[i].title)).toBeLessThanOrEqual(0);
    }
  });

  it("filters by category", () => {
    const network = getConceptsByCategory("network");
    expect(network.length).toBeGreaterThan(10);
    expect(network.every((concept) => concept.category === "network")).toBe(true);
  });

  it("resolves related concepts for http", () => {
    const related = getRelatedConcepts("http");
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((concept) => Boolean(concept.slug))).toBe(true);
  });

  it("groups git concepts by subcategory", () => {
    const groups = groupGitConceptsBySubcategory();
    expect(groups.length).toBeGreaterThan(0);
    expect(groups.every((group) => group.concepts.length > 0)).toBe(true);
  });

  it("finds dhcp by slug", () => {
    const dhcp = getConceptBySlug("dhcp");
    expect(dhcp?.title).toBe("DHCP");
    expect(dhcp?.category).toBe("network");
  });
});
