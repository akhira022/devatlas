import type { Metadata } from "next";

import { ComparisonCard } from "@/components/compare/comparison-card";
import { getAllComparisons } from "@/lib/content/get-comparisons";

export const metadata: Metadata = {
  title: "เปรียบเทียบ",
  description: "ตารางเปรียบเทียบแนวคิดที่มักสับสน — เลือกใช้เมื่อไหร่",
};

export default function ComparePage() {
  const comparisons = getAllComparisons();

  return (
    <div className="container px-4 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold">เปรียบเทียบ</h1>
        <p className="mt-2 text-muted-foreground">
          สับสนระหว่างสองแนวคิด? ดูตารางเปรียบเทียบและคำแนะนำว่าควรเลือกอะไรเมื่อไหร่
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {comparisons.map((comparison) => (
          <ComparisonCard key={comparison.slug} comparison={comparison} />
        ))}
      </div>
    </div>
  );
}
