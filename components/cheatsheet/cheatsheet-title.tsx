import type { Cheatsheet } from "@/lib/cheatsheet/types";

export function CheatsheetTitle({ sheet }: { sheet: Pick<Cheatsheet, "title" | "highlight"> }) {
  const [before, after] = sheet.title.split("{highlight}");
  return (
    <>
      {before}
      <span className="rounded-lg bg-emerald-500 px-2 text-white dark:text-zinc-950">
        {sheet.highlight}
      </span>
      {after}
    </>
  );
}
