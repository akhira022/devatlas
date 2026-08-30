import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getAllQuizConceptSlugs,
  getQuizzesGroupedByCategory,
  getTotalQuizQuestionCount,
} from "@/lib/content/get-quizzes";

export function QuizHub() {
  const groups = getQuizzesGroupedByCategory();
  const totalConcepts = getAllQuizConceptSlugs().length;
  const totalQuestions = getTotalQuizQuestionCount();

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary">{totalConcepts} หัวข้อ</Badge>
        <Badge variant="outline">{totalQuestions} ข้อสอบ</Badge>
      </div>

      {groups.map((group) => (
        <section key={group.categorySlug}>
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--category-color, inherit)" }}>
            {group.categoryName}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <Link key={item.slug} href={`/concepts/${item.slug}#quiz`}>
                <Card className="group h-full interactive-card">
                  <CardHeader className="pb-3">
                    <CardTitle as="h3" className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2">
                        <ClipboardList className="size-4 text-primary" />
                        {item.title}
                      </span>
                      <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription>{item.questionCount} ข้อ — ทดสอบความเข้าใจหลังอ่าน</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
