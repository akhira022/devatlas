"use client";

import { useState } from "react";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ConceptQuiz } from "@/types/quiz";

interface ConceptQuizBlockProps {
  quiz: ConceptQuiz;
}

export function ConceptQuizBlock({ quiz }: ConceptQuizBlockProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <section id="quiz" className="surface-muted scroll-mt-20 p-6">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">
        📝 ทดสอบความเข้าใจ
      </h2>
      <div className="space-y-6">
        {quiz.questions.map((q, qIndex) => {
          const selected = answers[qIndex];
          const isRevealed = revealed[qIndex];
          const isCorrect = selected === q.correctIndex;

          return (
            <div key={qIndex} className="space-y-3">
              <p className="font-medium">
                {qIndex + 1}. {q.question}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((option, oIndex) => {
                  let variant: "outline" | "default" | "destructive" = "outline";
                  if (isRevealed) {
                    if (oIndex === q.correctIndex) variant = "default";
                    else if (oIndex === selected) variant = "destructive";
                  } else if (selected === oIndex) {
                    variant = "default";
                  }

                  return (
                    <Button
                      key={oIndex}
                      variant={variant}
                      className="h-auto justify-start whitespace-normal px-4 py-3 text-left text-sm"
                      disabled={isRevealed}
                      onClick={() => setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }))}
                    >
                      {isRevealed && oIndex === q.correctIndex && (
                        <CheckCircle2 className="mr-2 size-4 shrink-0" />
                      )}
                      {isRevealed && oIndex === selected && oIndex !== q.correctIndex && (
                        <XCircle className="mr-2 size-4 shrink-0" />
                      )}
                      {!isRevealed && selected === oIndex && (
                        <Circle className="mr-2 size-4 shrink-0 fill-current" />
                      )}
                      {option}
                    </Button>
                  );
                })}
              </div>
              {selected !== undefined && !isRevealed && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setRevealed((prev) => ({ ...prev, [qIndex]: true }))}
                >
                  ดูเฉลย
                </Button>
              )}
              {isRevealed && (
                <p
                  className={`prose-content text-sm ${isCorrect ? "text-success" : "text-muted-foreground"}`}
                >
                  {isCorrect ? "✓ ถูกต้อง! " : "✗ ยังไม่ถูก — "}
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
