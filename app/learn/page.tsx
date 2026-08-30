import type { Metadata } from "next";

import { LearningPathCard } from "@/components/learn/learning-path-card";
import { getAllLearningPaths } from "@/lib/content/get-learning-paths";

export const metadata: Metadata = {
  title: "เส้นทางการเรียนรู้",
  description: "ลำดับบทเรียนที่จัดไว้ให้ — เรียนรู้ทีละขั้นตอนอย่างเป็นระบบ",
};

export default function LearnPage() {
  const paths = getAllLearningPaths();

  return (
    <div className="container px-4 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold">เส้นทางการเรียนรู้</h1>
        <p className="mt-2 text-muted-foreground">
          ไม่รู้จะเริ่มจากไหน? เลือกเส้นทางที่ตรงกับเป้าหมาย — แต่ละ path จัดลำดับบทเรียนให้แล้ว
          พร้อม scenario ท้ายทางเพื่อทดสอบความเข้าใจ
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((path) => (
          <LearningPathCard key={path.slug} path={path} />
        ))}
      </div>
    </div>
  );
}
