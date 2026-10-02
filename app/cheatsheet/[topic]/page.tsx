import { notFound } from "next/navigation";

import { CheatsheetGrid } from "@/components/cheatsheet/cheatsheet-grid";
import { CheatsheetTitle } from "@/components/cheatsheet/cheatsheet-title";
import { getCheatsheetBySlug, getCheatsheetSlugs } from "@/lib/cheatsheet";

interface CheatsheetPageProps {
  params: Promise<{ topic: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getCheatsheetSlugs().map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: CheatsheetPageProps) {
  const { topic } = await params;
  const sheet = getCheatsheetBySlug(topic);
  if (!sheet) return { title: "Cheat Sheet Not Found" };

  return {
    title: sheet.title.replace("{highlight}", sheet.highlight),
    description: sheet.description,
  };
}

export default async function CheatsheetPage({ params }: CheatsheetPageProps) {
  const { topic } = await params;
  const sheet = getCheatsheetBySlug(topic);
  if (!sheet) notFound();

  return (
    <div className="container px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl leading-relaxed font-bold tracking-tight md:text-4xl">
          <CheatsheetTitle sheet={sheet} />
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{sheet.description}</p>
      </div>
      <CheatsheetGrid items={sheet.items} />
    </div>
  );
}
