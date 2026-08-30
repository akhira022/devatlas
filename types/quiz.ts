export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ConceptQuiz {
  conceptSlug: string;
  questions: QuizQuestion[];
}
