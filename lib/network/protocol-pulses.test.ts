import { describe, expect, it } from "vitest";

import { getVisualizationBySlug } from "@/lib/visualization/get-visualizations";
import { PROTOCOL_PULSES } from "@/lib/network/protocol-pulses";

describe("PROTOCOL_PULSES", () => {
  it("covers the core network protocol cards", () => {
    const ids = PROTOCOL_PULSES.map((pulse) => pulse.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "http",
        "tcp",
        "udp",
        "tls",
        "dns",
        "dhcp",
        "smtp",
        "imap",
        "websocket",
        "sse",
        "rest",
        "graphql",
        "cors",
        "arp",
        "ip",
        "nat",
        "firewall",
        "proxy",
        "load-balancer",
        "cdn",
        "vpn",
      ]),
    );
    expect(ids).toHaveLength(21);
  });

  it("links every card to a live visualization or concept route", () => {
    for (const pulse of PROTOCOL_PULSES) {
      expect(pulse.href.startsWith("/visualize/") || pulse.href.startsWith("/concepts/")).toBe(
        true,
      );
      expect(pulse.title.length).toBeGreaterThan(0);
      expect(pulse.subtitle.length).toBeGreaterThan(0);
      expect(pulse.scene.type.length).toBeGreaterThan(0);

      if (pulse.href.startsWith("/visualize/")) {
        const slug = pulse.href.replace("/visualize/", "");
        expect(getVisualizationBySlug(slug), `${pulse.id} → ${slug}`).toBeTruthy();
      }
    }
  });

  it("does not point IMAP at the SMTP flow", () => {
    const imap = PROTOCOL_PULSES.find((pulse) => pulse.id === "imap");
    expect(imap?.href).toBe("/visualize/imap-flow");
  });

  it("points TLS at the HTTPS/TLS visualization", () => {
    const tls = PROTOCOL_PULSES.find((pulse) => pulse.id === "tls");
    expect(tls?.href).toBe("/visualize/https-flow");
  });
});
