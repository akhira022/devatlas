import { NETWORK_CHEATSHEET } from "@/lib/cheatsheet/network";
import type { Cheatsheet } from "@/lib/cheatsheet/types";

export const CHEATSHEETS: Cheatsheet[] = [NETWORK_CHEATSHEET];

export function getCheatsheetBySlug(slug: string): Cheatsheet | undefined {
  return CHEATSHEETS.find((sheet) => sheet.slug === slug);
}

export function getCheatsheetSlugs(): string[] {
  return CHEATSHEETS.map((sheet) => sheet.slug);
}
