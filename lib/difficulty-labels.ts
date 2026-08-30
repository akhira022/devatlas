export const DIFFICULTY_LABELS = {
  beginner: "เริ่มต้น",
  intermediate: "ปานกลาง",
  advanced: "ขั้นสูง",
} as const;

export type Difficulty = keyof typeof DIFFICULTY_LABELS;

export const DIFFICULTY_COLORS = {
  beginner:
    "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  intermediate:
    "bg-amber-500/10 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  advanced: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
} as const;

export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_LABELS[difficulty];
}
