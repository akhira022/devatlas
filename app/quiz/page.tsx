import type { Metadata } from "next";

import { QuizHub } from "@/components/quiz/quiz-hub";

export const metadata: Metadata = {
  title: "แบบทดสอบความเข้าใจ",
  description: "ทดสอบการอ่านเอกสาร — เลือกหัวข้อแล้วตอบคำถามหลังอ่าน concept",
};

export default function QuizPage() {
  return (
    <div className="container px-4 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold">แบบทดสอบความเข้าใจ</h1>
        <p className="mt-2 text-muted-foreground">
          อ่าน concept แล้วมาทดสอบ — คำถามอิงจากเนื้อหาในเอกสาร กดดูเฉลยพร้อมคำอธิบายทันที
        </p>
      </div>
      <QuizHub />
    </div>
  );
}
