import { Suspense } from "react";

import { KnowledgeGraph } from "@/components/graph/knowledge-graph";

interface GraphPageProps {
  searchParams: Promise<{ focus?: string; category?: string }>;
}

export default async function GraphPage({ searchParams }: GraphPageProps) {
  const { focus, category } = await searchParams;

  return (
    <div className="container px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Knowledge Graph</h1>
        <p className="mt-2 text-muted-foreground">
          สำรวจความเชื่อมโยงระหว่างแนวคิด — คลิกเพื่อไฮไลต์ ดับเบิลคลิกเพื่อเปิด
          หรือใช้รายการด้านล่างเพื่อนำทางด้วยคีย์บอร์ด
        </p>
      </div>

      <Suspense fallback={<div className="h-[500px] animate-pulse rounded-xl bg-muted/30" />}>
        <KnowledgeGraph initialFocus={focus} initialCategory={category} />
      </Suspense>
    </div>
  );
}
