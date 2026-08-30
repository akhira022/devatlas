"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { GraphNode } from "@/types/graph";

interface ConceptListPanelProps {
  nodes: GraphNode[];
  focusSlug: string | null;
  onSelect: (slug: string) => void;
  className?: string;
  id?: string;
}

export function ConceptListPanel({
  nodes,
  focusSlug,
  onSelect,
  className,
  id,
}: ConceptListPanelProps) {
  const sorted = [...nodes].sort((a, b) => a.label.localeCompare(b.label, "th"));

  return (
    <div id={id} className={cn("surface-muted", className)}>
      <div className="border-b border-border/60 px-4 py-3">
        <h2 className="text-sm font-semibold">รายการ Concept</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          ใช้คีย์บอร์ดเลือก concept ได้โดยตรง — กด Enter หรือคลิกลิงก์เพื่อเปิดหน้า
        </p>
      </div>
      <ul className="max-h-64 divide-y divide-border/40 overflow-y-auto" role="listbox" aria-label="รายการ concept ในกราฟ">
        {sorted.map((node) => {
          const isSelected = node.id === focusSlug;

          return (
            <li key={node.id} role="option" aria-selected={isSelected}>
              <div
                className={cn(
                  "flex items-center justify-between gap-2 px-4 py-2.5 transition-colors",
                  isSelected && "bg-primary/10",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(node.id)}
                  className={cn(
                    "min-w-0 flex-1 rounded-md px-1 py-1 text-left text-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isSelected ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className="block truncate">{node.label}</span>
                  <span className="block truncate text-xs capitalize text-muted-foreground">
                    {node.category}
                  </span>
                </button>
                <Link
                  href={`/concepts/${node.id}`}
                  className="shrink-0 rounded-md px-2 py-1 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  เปิด
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
