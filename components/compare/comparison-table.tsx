import Link from "next/link";

import type { Comparison } from "@/types/comparison";
import { Button } from "@/components/ui/button";

interface ComparisonTableProps {
  comparison: Comparison;
}

export function ComparisonTable({ comparison }: ComparisonTableProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {comparison.items.map((item) => (
          <div
            key={item.conceptSlug}
            className="surface-muted p-5"
          >
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.tagline}</p>
            <Button
              variant="link"
              className="mt-2 h-auto p-0"
              render={<Link href={`/concepts/${item.conceptSlug}`} />}
            >
              อ่านเพิ่มเติม →
            </Button>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">หัวข้อ</th>
              {comparison.items.map((item) => (
                <th key={item.conceptSlug} className="px-4 py-3 text-left font-medium">
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-muted/25 dark:bg-card/20" : ""}>
                <td className="px-4 py-3 font-medium text-muted-foreground">{row.label}</td>
                {row.values.map((value, j) => (
                  <td key={j} className="prose-content px-4 py-3">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {comparison.whenToUse.length > 0 && (
        <section className="surface-muted p-6">
          <h2 className="mb-4 text-lg font-semibold">เลือกใช้เมื่อไหร่?</h2>
          <ul className="space-y-2">
            {comparison.whenToUse.map((item) => (
              <li key={item.label} className="prose-content flex gap-2">
                <span className="text-primary">→</span>
                <span>
                  <strong>{item.label}</strong> — เลือก <strong>{item.pick}</strong>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
