import { describe, expect, it } from "vitest";

import { PROTOCOL_PULSES } from "@/lib/network/protocol-pulses";

describe("PROTOCOL_PULSES", () => {
  it("covers the eight network protocol cards", () => {
    expect(PROTOCOL_PULSES.map((pulse) => pulse.id)).toEqual([
      "http",
      "tcp",
      "udp",
      "tls",
      "dns",
      "dhcp",
      "smtp",
      "imap",
    ]);
  });

  it("links every card to a concept or visualization route", () => {
    for (const pulse of PROTOCOL_PULSES) {
      expect(pulse.href.startsWith("/visualize/") || pulse.href.startsWith("/concepts/")).toBe(
        true,
      );
      expect(pulse.title.length).toBeGreaterThan(0);
      expect(pulse.subtitle.length).toBeGreaterThan(0);
    }
  });

  it("does not point IMAP at the SMTP flow", () => {
    const imap = PROTOCOL_PULSES.find((pulse) => pulse.id === "imap");
    expect(imap?.href).toBe("/visualize/imap-flow");
  });
});
