import { CheatsheetCard } from "@/components/cheatsheet/cheatsheet-card";
import type { CheatsheetItem } from "@/lib/cheatsheet/types";

interface CheatsheetGridProps {
  items: CheatsheetItem[];
}

export function CheatsheetGrid({ items }: CheatsheetGridProps) {
  return (
    <ol className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <li key={item.id}>
          <CheatsheetCard item={item} index={index} />
        </li>
      ))}
    </ol>
  );
}
