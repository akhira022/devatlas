import Link from "next/link";
import { LearningPathCard } from "@/components/learn/learning-path-card";
import { getAllLearningPaths } from "@/lib/content/get-learning-paths";

export function LearningPathPreview() {
  const paths = getAllLearningPaths();

  return (
    <section className="container px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">เส้นทางการเรียนรู้</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ลำดับบทเรียนที่จัดไว้ให้ — ไม่ต้องเดาว่าควรอ่านอะไรก่อน
          </p>
        </div>
        <Link href="/learn" className="text-sm text-primary hover:underline">
          ดูทั้งหมด →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((path) => (
          <LearningPathCard key={path.slug} path={path} />
        ))}
      </div>
    </section>
  );
}
