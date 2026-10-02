import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { CHEATSHEETS, getCheatsheetBySlug } from "@/lib/cheatsheet";
import { NETWORK_CHEATSHEET } from "@/lib/cheatsheet/network";
import { PROTOCOL_PULSES } from "@/lib/network/protocol-pulses";

describe("cheatsheets", () => {
  it("has 20 unique networking items", () => {
    const ids = NETWORK_CHEATSHEET.items.map((item) => item.id);
    expect(ids).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
  });

  it("finds sheets by slug", () => {
    expect(getCheatsheetBySlug("network")).toBe(NETWORK_CHEATSHEET);
    expect(getCheatsheetBySlug("missing")).toBeUndefined();
  });

  for (const sheet of CHEATSHEETS) {
    describe(sheet.slug, () => {
      it("keeps the highlight placeholder in the title", () => {
        expect(sheet.title).toContain("{highlight}");
      });

      it("links only to concepts that exist", () => {
        for (const item of sheet.items) {
          if (!item.conceptSlug) continue;
          const file = path.join(process.cwd(), "data/concepts", `${item.conceptSlug}.json`);
          expect(existsSync(file), `${item.id} → ${item.conceptSlug}`).toBe(true);
        }
      });

      it("reuses only protocol pulses that exist", () => {
        const pulseIds = new Set(PROTOCOL_PULSES.map((pulse) => pulse.id));
        for (const item of sheet.items) {
          if (item.diagram.kind === "pulse") {
            expect(pulseIds.has(item.diagram.pulseId), item.id).toBe(true);
          }
        }
      });
    });
  }
});
