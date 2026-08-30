import quizzesData from "@/data/quizzes.json";
import { getAllCategories, getConceptBySlug } from "@/lib/content/get-concepts";
import type { ConceptQuiz } from "@/types/quiz";

const quizzes = quizzesData as Record<string, ConceptQuiz>;

export function getQuizForConcept(conceptSlug: string): ConceptQuiz | undefined {
  return quizzes[conceptSlug];
}

export function getAllQuizzes(): ConceptQuiz[] {
  return Object.values(quizzes);
}

export function getAllQuizConceptSlugs(): string[] {
  return Object.keys(quizzes);
}

export function getQuizzesGroupedByCategory(): Array<{
  categorySlug: string;
  categoryName: string;
  items: Array<{ slug: string; title: string; questionCount: number }>;
}> {
  const categories = getAllCategories();
  const grouped = new Map<string, Array<{ slug: string; title: string; questionCount: number }>>();

  for (const slug of getAllQuizConceptSlugs()) {
    const concept = getConceptBySlug(slug);
    const quiz = quizzes[slug];
    if (!concept || !quiz) continue;

    const list = grouped.get(concept.category) ?? [];
    list.push({
      slug,
      title: concept.title,
      questionCount: quiz.questions.length,
    });
    grouped.set(concept.category, list);
  }

  return categories
    .filter((cat) => grouped.has(cat.slug))
    .map((cat) => ({
      categorySlug: cat.slug,
      categoryName: cat.name,
      items: (grouped.get(cat.slug) ?? []).sort((a, b) => a.title.localeCompare(b.title, "th")),
    }));
}

export function getTotalQuizQuestionCount(): number {
  return getAllQuizzes().reduce((sum, q) => sum + q.questions.length, 0);
}
