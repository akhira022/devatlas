import beginnerDeveloper from "@/data/learning-paths/beginner-developer.json";
import cliEssentials from "@/data/learning-paths/cli-essentials.json";
import gitWorkflow from "@/data/learning-paths/git-workflow.json";
import iotStarter from "@/data/learning-paths/iot-starter.json";
import networkFundamentals from "@/data/learning-paths/network-fundamentals.json";
import securityBasics from "@/data/learning-paths/security-basics.json";
import type { LearningPath } from "@/types/learning-path";

const learningPaths: LearningPath[] = [
  beginnerDeveloper,
  networkFundamentals,
  gitWorkflow,
  cliEssentials,
  iotStarter,
  securityBasics,
] as LearningPath[];

export function getAllLearningPaths(): LearningPath[] {
  return [...learningPaths].sort((a, b) => a.title.localeCompare(b.title, "th"));
}

export function getLearningPathBySlug(slug: string): LearningPath | undefined {
  return learningPaths.find((path) => path.slug === slug);
}

export function getLearningPathSlugs(): string[] {
  return learningPaths.map((path) => path.slug);
}

export function getLearningPathsByCategory(category: string): LearningPath[] {
  return learningPaths.filter((path) => path.category === category);
}
