import type { Metadata } from "next";

import { DecisionTreeCard } from "@/components/decide/decision-tree-player";
import { getAllDecisionTrees } from "@/lib/content/get-decision-trees";

export const metadata: Metadata = {
  title: "ช่วยเลือกเทคโนโลยี",
  description: "Decision tree — ตอบคำถามสั้น ๆ แล้วได้คำแนะนำว่าควรใช้อะไร",
};

export default function DecidePage() {
  const trees = getAllDecisionTrees();

  return (
    <div className="container px-4 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold">ช่วยเลือกเทคโนโลยี</h1>
        <p className="mt-2 text-muted-foreground">
          ไม่แน่ใจว่าควรใช้อะไร? เลือกหัวข้อแล้วตอบคำถามทีละข้อ — ได้คำแนะนำพร้อมลิงก์ไปอ่านต่อ
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trees.map((tree) => (
          <DecisionTreeCard key={tree.slug} tree={tree} />
        ))}
      </div>
    </div>
  );
}
